import { Injectable } from '@nestjs/common';
import { SemesterReportRepository } from 'src/repositories/semester-report.repository';

@Injectable()
export class SemesterReportService {
    constructor(private readonly semesterReportRepository: SemesterReportRepository) { }
    getSemesterReportList() {
        return this.semesterReportRepository.findAllReport();
     }
}
