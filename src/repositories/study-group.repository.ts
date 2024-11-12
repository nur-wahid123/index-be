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

  async detachSubject(subjectDto: LinkSubjectDto) {
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
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async linkSubject(subjectDto: LinkSubjectDto) {
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
      await queryRunner.manager.save(studyGroup);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
  async linkBatchSubject(subjectDto: BatchLinkSubjectDto) {
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
