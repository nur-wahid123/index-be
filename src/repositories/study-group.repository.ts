import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StudyGroup } from '../entities/study-group.entity';
import { Subject } from '../entities/subject.entity';
import {
  BatchLinkSubjectDto,
  LinkSubjectDto,
} from '../modules/study-groups/dto/link-subject.dto';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class StudyGroupRepository extends Repository<StudyGroup> {
  constructor(private readonly dataSource: DataSource) {
    super(StudyGroup, dataSource.createEntityManager());
  }

  async saveStudyGroup(studyGroup: StudyGroup) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isStudyGroupExists = await queryRunner.manager.findOne(StudyGroup, {
        where: { name: studyGroup.name },
      });
      if (isStudyGroupExists) {
        throw new NotFoundException('Study Group already exist');
      }
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
      return studyGroup;
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

  async updateStudyGroup(studyGroup: StudyGroup) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isStudyGroupExists = await queryRunner.manager.findOne(StudyGroup, {
        where: { name: studyGroup.name },
      });
      if (isStudyGroupExists) {
        throw new NotFoundException('Study Group already exist');
      }
      const updatedStudyGroup = await queryRunner.manager.findOne(StudyGroup, {
        where: { id: studyGroup.id },
      });
      if (!updatedStudyGroup) {
        throw new NotFoundException('Study Group not found');
      }
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
      return studyGroup;
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

  async detachSubject(subjectDto: LinkSubjectDto, _userId: number) {
    const { studyGroupId, subjectId } = subjectDto;
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const studyGroup = await queryRunner.manager.findOne(StudyGroup, {
        where: { id: studyGroupId },
        relations: ['subjects'],
      });
      if (!studyGroup) {
        throw new NotFoundException('study group not found');
      }
      const subject = await queryRunner.manager.findOne(Subject, {
        where: { id: subjectId },
      });
      if (!subject) {
        throw new NotFoundException('subject not found');
      }

      studyGroup.subjects = studyGroup.subjects.filter(
        (subject) => subject.id !== subjectId,
      );
      studyGroup.updatedBy = _userId;
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async linkSubject(subjectDto: LinkSubjectDto, _userId: number) {
    const { studyGroupId, subjectId } = subjectDto;
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const studyGroup = await queryRunner.manager.findOne(StudyGroup, {
        where: { id: studyGroupId },
        relations: ['subjects'],
      });
      if (!studyGroup) {
        throw new NotFoundException('study group not found');
      }
      const subject = await queryRunner.manager.findOne(Subject, {
        where: { id: subjectId },
      });
      if (!subject) {
        throw new NotFoundException('subject not found');
      }

      studyGroup.subjects.push(subject);
      studyGroup.updatedBy = _userId;
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async linkBatchSubject(subjectDto: BatchLinkSubjectDto, _userId: number) {
    const { studyGroupId, subjectsId } = subjectDto;
    const queryRunner = this.dataSource.createQueryRunner();

    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      const studyGroup = await queryRunner.manager.findOne(StudyGroup, {
        where: { id: studyGroupId },
        relations: ['subjects'],
      });
      if (!studyGroup) {
        throw new NotFoundException('study group not found');
      }
      const subjects = await queryRunner.manager.find(Subject, {
        where: { id: In(subjectsId) },
      });
      if (subjects.length !== subjectsId.length) {
        throw new NotFoundException('one or more subject not found');
      }
      subjects.forEach((subject) => {
        studyGroup.subjects.push(subject);
      });
      studyGroup.updatedBy = _userId;
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
