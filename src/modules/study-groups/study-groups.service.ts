import { Injectable } from '@nestjs/common';
import { StudyGroupRepository } from '../../repositories/study-group.repository';
import { BatchLinkSubjectDto, LinkSubjectDto } from './dto/link-subject.dto';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { StudyGroup } from 'src/entities/study-group.entity';
import { UpdateStudyGroupDto } from './dto/update-study-group.dto';
import { FilterDto } from 'src/commons/dto/filter.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';

@Injectable()
export class StudyGroupsService {
  constructor(private readonly studyGroupRepository: StudyGroupRepository) {}

  createStudyGroup(createStudyGroupDto: CreateStudyGroupDto, userId: number) {
    const studyGroupEntity = new StudyGroup();
    studyGroupEntity.name = createStudyGroupDto.name;
    studyGroupEntity.createdBy = userId;
    return this.studyGroupRepository.saveStudyGroup(studyGroupEntity);
  }

  updateStudyGroup(
    id: number,
    updateStudyGroupDto: UpdateStudyGroupDto,
    userId: number,
  ) {
    const studyGroupEntity = new StudyGroup();
    studyGroupEntity.id = id;
    studyGroupEntity.name = updateStudyGroupDto.name;
    studyGroupEntity.updatedBy = userId;
    return this.studyGroupRepository.updateStudyGroup(studyGroupEntity);
  }

  linkSubject(subjectDto: LinkSubjectDto, userId: number) {
    return this.studyGroupRepository.linkSubject(subjectDto, userId);
  }

  detachSubject(subjectDto: LinkSubjectDto, userId: number) {
    return this.studyGroupRepository.detachSubject(subjectDto, userId);
  }

  linkBatchSubject(subjectDto: BatchLinkSubjectDto, userId: number) {
    return this.studyGroupRepository.linkBatchSubject(subjectDto, userId);
  }

  findOne(id: number) {
    return this.studyGroupRepository.findOne({ where: { id: id } });
  }

  async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.studyGroupRepository.findAll(
      filter,
      pageOptionsDto,
    );
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }

  async remove(id: number, userId: number) {
    const studyGroup = new StudyGroup();
    studyGroup.id = id;
    studyGroup.deletedAt = new Date();
    studyGroup.deletedBy = userId;
    return this.studyGroupRepository.removeStudyGroup(studyGroup);
  }
}
