import { Injectable, NotFoundException } from '@nestjs/common';
import { SemesterReportRepository } from './../../repositories/semester-report.repository';
import {
  CreateBatchSemesterReportDto,
  CreateSemesterReportDto,
} from './dto/create-semester-report.dto';
import { QueryGetStudentDto } from './dto/query-get-student.dto';
import { ReportDetailDto } from './dto/response/report-detail.dto';

@Injectable()
export class SemesterReportService {
  constructor(
    private readonly semesterReportRepository: SemesterReportRepository,
  ) {}

  getSemesterReportList() {
    return this.semesterReportRepository.findAllReport();
  }

  async getStudentReport(studentId: number, filterReport: QueryGetStudentDto) {
    const data = await this.semesterReportRepository.findOneReport(
      studentId,
      filterReport,
    );
    if (!data) {
      throw new NotFoundException('report not found');
    }
    const response = new ReportDetailDto();
    Object.assign(response, data);
    return data;
  }

  createSemesterReport(body: CreateSemesterReportDto) {
    return this.semesterReportRepository.createSemesterReport(body);
  }

  createBatchSemesterReport(body: CreateBatchSemesterReportDto) {
    return this.semesterReportRepository.createBatchSemesterReport(body);
  }
}
