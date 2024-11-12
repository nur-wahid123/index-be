import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SemesterReportService } from './semester-report.service';
import {
  CreateBatchSemesterReportDto,
  CreateSemesterReportDto,
} from './dto/create-semester-report.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('semester-report')
export class SemesterReportController {
  constructor(private readonly semesterReportService: SemesterReportService) {}

  @Get('list')
  async getSemesterReportList() {
    return await this.semesterReportService.getSemesterReportList();
  }

  @Post('create')
  async createSemesterReport(@Body() body: CreateSemesterReportDto) {
    return await this.semesterReportService.createSemesterReport(body);
  }

  @Post('create/batch')
  async createBatchSemesterReport(@Body() body: CreateBatchSemesterReportDto) {
    return await this.semesterReportService.createBatchSemesterReport(body);
  }
}
