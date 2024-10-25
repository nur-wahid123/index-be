import { Controller, Get } from '@nestjs/common';
import { SemesterReportService } from './semester-report.service';

@Controller('semester-report')
export class SemesterReportController {
  constructor(private readonly semesterReportService: SemesterReportService) {
  }
  @Get('list')
  async getSemesterReportList() {
    return await this.semesterReportService.getSemesterReportList();
  }
}
