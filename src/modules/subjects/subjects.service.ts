import { Injectable } from '@nestjs/common';
import {
  CreateBatchSubjectDto,
  CreateSubjectDto,
} from './dto/create-subject.dto';
import { SubjectRepository } from './../../repositories/subject.repository';
import { Subject } from './../../entities/subject.entity';
import QuerySubjectDto from './dto/query-subject.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  createSubject(createSubjectDto: CreateSubjectDto, userId: number) {
    const newSubject = new Subject();
    newSubject.name = createSubjectDto.name;
    newSubject.createdBy = userId;
    return this.subjectRepository.saveSubject(newSubject);
  }

  removeSubject(id: number, userId: number) {
    const subject = new Subject();
    subject.id = id;
    subject.deletedAt = new Date();
    subject.deletedBy = userId;
    return this.subjectRepository.removeSubject(subject);
  }

  updateSubject(
    id: number,
    createSubjectDto: CreateSubjectDto,
    _userId: number,
  ) {
    const newSubject = new Subject();
    newSubject.name = createSubjectDto.name;
    newSubject.id = id;
    newSubject.updatedBy = _userId;
    return this.subjectRepository.updateSubject(newSubject);
  }

  batchCreate(batch: CreateBatchSubjectDto) {
    const subjects: Subject[] = batch.subjects.map((subject) => {
      const newSubject = new Subject();
      newSubject.name = subject.name;
      return newSubject;
    });
    return this.subjectRepository.createBatch(subjects);
  }

  find(id: number) {
    return this.subjectRepository.findOne({
      where: { id },
      relations: { studyGroups: true },
    });
  }

  async findAll(filter: QuerySubjectDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.subjectRepository.findSubjects(
      filter,
      pageOptionsDto,
    );
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }
}
