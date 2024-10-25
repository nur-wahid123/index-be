import { Test, TestingModule } from '@nestjs/testing';
import { SemesterReportService } from './semester-report.service';

describe('SemesterReportService', () => {
  let service: SemesterReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemesterReportService],
    }).compile();

    service = module.get<SemesterReportService>(SemesterReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
