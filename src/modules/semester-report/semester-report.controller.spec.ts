import { Test, TestingModule } from '@nestjs/testing';
import { SemesterReportController } from './semester-report.controller';
import { SemesterReportService } from './semester-report.service';
import { SemesterReportRepository } from './../../repositories/semester-report.repository';

describe('SemesterReportController', () => {
  let controller: SemesterReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemesterReportController],
      providers: [SemesterReportService, SemesterReportRepository],
    }).compile();

    controller = module.get<SemesterReportController>(SemesterReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
