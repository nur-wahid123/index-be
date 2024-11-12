import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsService } from './subjects.service';
import { SubjectRepository } from '../../repositories/subject.repository';
import { DataSource } from 'typeorm';

describe('SubjectsService', () => {
  let service: SubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectsService, SubjectRepository, DataSource],
    }).compile();

    service = module.get<SubjectsService>(SubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
