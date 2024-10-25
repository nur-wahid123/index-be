import { Injectable } from "@nestjs/common";
import { SemesterReport } from "src/entities/semester.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SemesterReportRepository extends Repository<SemesterReport> {
    constructor(private readonly dataSource: DataSource) {
        super(SemesterReport, dataSource.manager)
    }

    async findAllReport(){
        const query = this.dataSource
        .createQueryBuilder(SemesterReport, 'semesterReport')
        .leftJoinAndSelect('semesterReport.student', 'student')
        .leftJoinAndSelect('student.studyGroup', 'studyGroup')
        .leftJoinAndSelect('studyGroup.subjects', 'subjects')
        .leftJoinAndSelect('semesterReport.scores', 'scores')
        .leftJoinAndSelect('scores.subject', 'subject')
        .leftJoinAndSelect('scores.extracurricularScore', 'extracurricularScore')
        .leftJoinAndSelect('extracurricularScore.extracurricular', 'extracurricular')
        return await query.getMany();
    }
}