import { Injectable } from '@nestjs/common';
import { CreateBatchSubjectDto } from './dto/create-batch-subject.dto';
import { SubjectRepository } from './../../repositories/subject.repository';
import { Subject } from './../../entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectRepository: SubjectRepository) {}
  batchCreate(batch: CreateBatchSubjectDto[]) {
    const subjects: Subject[] = batch.map((subject) => {
      const newSubject = new Subject();
      newSubject.name = subject.name;
      return newSubject;
    });
    return this.subjectRepository.createBatch(subjects);
  }

  findAll() {
    return this.subjectRepository.find({ relations: ['studyGroups'] });
  }
}
