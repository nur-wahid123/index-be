import { Injectable } from '@nestjs/common';
import { StudyGroupRepository } from '../../repositories/study-group.repository';
import { BatchLinkSubjectDto, LinkSubjectDto } from './dto/link-subject.dto';

@Injectable()
export class StudyGroupsService {
  constructor(private readonly studyGroupRepository: StudyGroupRepository) {}

  linkSubject(subjectDto: LinkSubjectDto) {
    return this.studyGroupRepository.linkSubject(subjectDto);
  }

  detachSubject(subjectDto: LinkSubjectDto) {
    return this.studyGroupRepository.detachSubject(subjectDto);
  }

  linkBatchSubject(subjectDto: BatchLinkSubjectDto) {
    return this.studyGroupRepository.linkBatchSubject(subjectDto);
  }

  findAll() {
    return this.studyGroupRepository.find({
      relations: { subjects: true },
    });
  }
}
