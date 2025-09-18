import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from '../entities/subject.entity';
import { DataSource, Not, Repository, SelectQueryBuilder } from 'typeorm';
import QuerySubjectDto from 'src/modules/subjects/dto/query-subject.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { StudyGroup } from 'src/entities/study-group.entity';
import { ResponseSubjectDto } from 'src/modules/subjects/dto/response/response-subject.dto';
import { Order } from 'src/enums/order.enum';

@Injectable()
export class SubjectRepository extends Repository<Subject> {
  constructor(private readonly dataSource: DataSource) {
    super(Subject, dataSource.createEntityManager());
  }

  async saveSubject(subject: Subject) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isSubjectExists = await queryRunner.manager.findOne(Subject, {
        where: { name: subject.name },
      });
      if (isSubjectExists) {
        throw new NotFoundException('Study Group already exist');
      }
      const data = await queryRunner.manager.save(subject);
      subject.displayIndex = data.id;
      await queryRunner.manager.save(subject);
      await queryRunner.commitTransaction();
      return subject;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Internal server error');
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async removeSubject(subject: Subject) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isSubjectExists = await queryRunner.manager.findOne(Subject, {
        where: { id: subject.id },
        select: ['id', 'studyGroups'],
        relations: ['studyGroups'],
      });
      if (!isSubjectExists) {
        throw new NotFoundException('Subject not found');
      }
      if (isSubjectExists.studyGroups.length > 0) {
        throw new BadRequestException(['Subject has study groups']);
      }
      await queryRunner.manager.save(subject);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Internal server error');
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async updateSubject(subject: Subject, displayIndex: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isSubjectExists = await queryRunner.manager.findOne(Subject, {
        where: { name: subject.name, id: Not(subject.id) },
      });
      if (isSubjectExists) {
        throw new NotFoundException('Subject already exist');
      }
      const updatedSubject = await queryRunner.manager.findOne(Subject, {
        where: { id: subject.id },
        select: ['id', 'displayIndex', 'name', 'updatedBy'],
      });
      let differentDisplayIndex: Subject;
      if (displayIndex !== updatedSubject.displayIndex) {
        differentDisplayIndex = await queryRunner.manager.findOne(Subject, {
          where: { displayIndex },
        });
        if (differentDisplayIndex) {
          // Use a temporary value to avoid unique constraint violation
          const tempDisplayIndex = -1;
          differentDisplayIndex.displayIndex = tempDisplayIndex;
          await queryRunner.manager.save(differentDisplayIndex);

          subject.displayIndex = displayIndex;
          await queryRunner.manager.save(subject);

          differentDisplayIndex.displayIndex = updatedSubject.displayIndex;
          await queryRunner.manager.save(differentDisplayIndex);
        } else {
          throw new NotFoundException('Subject not found');
        }
      } else {
        await queryRunner.manager.save(subject);
      }
      if (!updatedSubject) {
        throw new NotFoundException('Subject not found');
      }
      await queryRunner.commitTransaction();
      return subject;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException('Internal server error');
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findSubjects(filter: QuerySubjectDto, pageOptionsDto: PageOptionsDto) {
    const { page, take, skip } = pageOptionsDto;
    const query = this.dataSource
      .createQueryBuilder(Subject, 'subject')
      .leftJoin('subject.studyGroups', 'studyGroup')
      .select(['subject.id', 'subject.name', 'subject.displayIndex'])
      .addSelect(
        'ROW_NUMBER() OVER (ORDER BY subject.displayIndex)',
        'fakeDisplayIndex',
      )
      .addSelect('ARRAY_AGG(DISTINCT studyGroup.id)', 'studyGroupIds')
      .where((qb) => {
        this.applyFilters(qb, filter);
      })
      .groupBy('subject.id');
    if (page && take) {
      query.skip(skip).take(take);
    }
    query.orderBy('subject.displayIndex', Order.ASC);
    const data = await query.getRawMany<{
      subject_id: number;
      subject_name: string;
      subject_display_index: number;
      fakeDisplayIndex: number;
      studyGroupIds: number[];
    }>();
    const subjects = data.map((item) => {
      const subject = new ResponseSubjectDto();
      subject.id = item.subject_id;
      subject.name = item.subject_name;
      subject.displayIndex = item.subject_display_index;
      subject.fakeDisplayIndex = Number(item.fakeDisplayIndex);
      subject.studyGroups = item.studyGroupIds.map((id) => {
        const studyGroup = new StudyGroup();
        studyGroup.id = id;
        return studyGroup;
      });
      return subject;
    });
    const count = await query.getCount();
    return { data: subjects, itemCount: count };
  }

  applyFilters(qb: SelectQueryBuilder<Subject>, filter: QuerySubjectDto) {
    const { search } = filter;
    if (search) {
      qb.andWhere('LOWER(subject.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
  }

  async createBatch(createSubjectDto: Subject[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      for (let i = 0; i < createSubjectDto.length; i++) {
        const subject = createSubjectDto[i];
        let newSubject = await queryRunner.manager.findOne(Subject, {
          where: { name: subject.name },
        });
        if (newSubject) {
          continue;
        }
        newSubject = new Subject();
        newSubject.name = subject.name;
        await queryRunner.manager.save(newSubject);
      }
      await queryRunner.commitTransaction();
      return { msg: 'success' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
