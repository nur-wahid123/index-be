import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassEntity } from './../../entities/class.entity';
import { ClassRepository } from './../../repositories/class.repository';
import { QueryClassDto } from './dto/query-class.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { StudyGroup } from 'src/entities/study-group.entity';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  createClass(createClassDto: CreateClassDto, userId: number) {
    const classEntity = new ClassEntity();
    const stGr = new StudyGroup();
    stGr.id = createClassDto.studyGroupId;
    classEntity.studyGroup = stGr;
    classEntity.name = createClassDto.name.toUpperCase();
    classEntity.createdBy = userId;
    return this.classRepository.saveClass(classEntity);
  }

  updateClass(id: number, updateClassDto: UpdateClassDto, userId: number) {
    const classEntity = new ClassEntity();
    classEntity.id = id;
    classEntity.name = updateClassDto.name;
    classEntity.updatedBy = userId;
    const stGr = new StudyGroup();
    stGr.id = updateClassDto.studyGroupId;
    classEntity.studyGroup = stGr;
    return this.classRepository.updateClass(classEntity);
  }

  removeClass(id: number, userId: number) {
    const classEntity = new ClassEntity();
    classEntity.id = id;
    classEntity.deletedAt = new Date();
    classEntity.deletedBy = userId;
    return this.classRepository.removeClass(classEntity);
  }

  async findClass(id: number) {
    return this.classRepository.findOne({
      where: { id: id },
      relations: { studyGroup: true },
    });
  }

  async findAllClass(query: QueryClassDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.classRepository.findClass(
      query,
      pageOptionsDto,
    );
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }
}
