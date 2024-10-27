import { Injectable } from '@nestjs/common';
import { SemesterReportRepository } from 'src/repositories/semester-report.repository';
import { CreateBatchSemesterReportDto, CreateSemesterReportDto } from './dto/create-semester-report.dto';

@Injectable()
export class SemesterReportService {
    constructor(private readonly semesterReportRepository: SemesterReportRepository) { }
    getSemesterReportList() {
        return this.semesterReportRepository.findAllReport();
     }

    createSemesterReport(body: CreateSemesterReportDto) {
        return this.semesterReportRepository.createSemesterReport(body);
    }
    createBatchSemesterReport(body: CreateBatchSemesterReportDto) {
        return this.semesterReportRepository.createBatchSemesterReport(body);
    }
}
