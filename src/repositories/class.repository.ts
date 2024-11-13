import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { ClassEntity } from 'src/entities/class.entity';
import { QueryClassDto } from 'src/modules/class/dto/query-class.dto';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  findClass(filter: QueryClassDto, pageOptionsDto: PageOptionsDto) {
    const { take, skip, order, page } = pageOptionsDto;
    const qb = this.dataSource
      .createQueryBuilder(ClassEntity, 'class')
      .leftJoinAndSelect('class.students', 'student')
      .leftJoinAndSelect('class.studyGroup', 'studyGroup')
      .skip(skip);
    this.applyFilters(qb, filter);
    if (page && skip) {
      qb.take(take);
    }
    qb.orderBy('class.id', order);
    return qb.getManyAndCount();
  }

  applyFilters(qb: SelectQueryBuilder<ClassEntity>, filter: QueryClassDto) {
    const { search, studyGroupId } = filter;
    if (search) {
      qb.andWhere('LOWER(class.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }
    if (studyGroupId) {
      qb.andWhere('studyGroup.id = :studyGroupId', {
        studyGroupId,
      });
    }
  }

  async updateClass(classEntity: ClassEntity) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isClassExist = await queryRunner.manager.findOne(ClassEntity, {
        where: { name: classEntity.name },
        lock: { mode: 'pessimistic_write' },
      });
      if (isClassExist) {
        throw new NotFoundException('Class already exist');
      }
      const classToUpdate = await queryRunner.manager.findOne(ClassEntity, {
        where: { id: classEntity.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!classToUpdate) {
        throw new NotFoundException('Class not found');
      }
      await queryRunner.manager.save(classEntity);
      await queryRunner.commitTransaction();
      return classEntity;
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

  async saveClass(classEntity: ClassEntity) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isClassExist = await queryRunner.manager.findOne(ClassEntity, {
        where: { name: classEntity.name },
      });
      if (isClassExist) {
        throw new NotFoundException('Class already exist');
      }
      await queryRunner.manager.save(classEntity);
      await queryRunner.commitTransaction();
      return classEntity;
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

  async deleteClass(classEntity) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const isClassExist = await queryRunner.manager.findOne(ClassEntity, {
        where: { id: classEntity.id },
      });
      if (!isClassExist) {
        throw new NotFoundException('Class not found');
      }
      await queryRunner.manager.save(classEntity);
      await queryRunner.commitTransaction();
      return classEntity;
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
}
