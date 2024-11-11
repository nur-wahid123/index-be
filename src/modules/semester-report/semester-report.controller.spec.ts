import { Test, TestingModule } from '@nestjs/testing';
import { SemesterReportController } from './semester-report.controller';
import { SemesterReportService } from './semester-report.service';

describe('SemesterReportController', () => {
  let controller: SemesterReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemesterReportController],
      providers: [SemesterReportService],
    }).compile();

    controller = module.get<SemesterReportController>(SemesterReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
