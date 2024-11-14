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

  async updateSubject(subject: Subject) {
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
      });
      if (!updatedSubject) {
        throw new NotFoundException('Subject not found');
      }
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

  findSubjects(filter: QuerySubjectDto, pageOptionsDto: PageOptionsDto) {
    const { page, take, skip, order } = pageOptionsDto;
    const query = this.dataSource
      .createQueryBuilder(Subject, 'subject')
      .leftJoinAndSelect('subject.studyGroups', 'studyGroup')
      .where((qb) => {
        this.applyFilters(qb, filter);
      })
      .take(take);
    if (page && take) {
      query.skip(skip);
    }
    query.orderBy('subject.id', order);
    return query.getManyAndCount();
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
    queryRunner.connect();
    try {
      queryRunner.startTransaction();
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
