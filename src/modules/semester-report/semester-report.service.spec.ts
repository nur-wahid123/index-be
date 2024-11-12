import { Test, TestingModule } from '@nestjs/testing';
import { SemesterReportService } from './semester-report.service';
import { SemesterReportRepository } from '../../repositories/semester-report.repository';
import { StudyGroupRepository } from '../../repositories/study-group.repository';
import { SubjectRepository } from '../../repositories/subject.repository';
import { DataSource } from 'typeorm';

describe('SemesterReportService', () => {
  let service: SemesterReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemesterReportService,
        SemesterReportRepository,
        StudyGroupRepository,
        SubjectRepository,
        DataSource,
      ],
    }).compile();

    service = module.get<SemesterReportService>(SemesterReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
