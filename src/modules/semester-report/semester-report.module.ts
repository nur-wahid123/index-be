import { Module } from '@nestjs/common';
import { SemesterReportService } from './semester-report.service';
import { SemesterReportController } from './semester-report.controller';
import { SemesterReportRepository } from 'src/repositories/semester-report.repository';

@Module({
  controllers: [SemesterReportController],
  providers: [SemesterReportService,SemesterReportRepository],
})
export class SemesterReportModule {}
