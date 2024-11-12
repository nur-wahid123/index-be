import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExtracurricularScore } from '../entities/extracurricular-score.entity';
import { Extracurricular } from '../entities/extracurricular.entity';
import { Score } from '../entities/score.entity';
import { SemesterReport } from '../entities/semester.entity';
import { Student } from '../entities/student.entity';
import { Subject } from '../entities/subject.entity';
import {
  CreateBatchSemesterReportDto,
  CreateSemesterReportDto,
} from '../modules/semester-report/dto/create-semester-report.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SemesterReportRepository extends Repository<SemesterReport> {
  constructor(private readonly dataSource: DataSource) {
    super(SemesterReport, dataSource.manager);
  }

  async findAllReport() {
    const query = this.dataSource
      .createQueryBuilder(SemesterReport, 'semesterReport')
      .leftJoinAndSelect('semesterReport.student', 'student')
      .leftJoinAndSelect('student.studyGroup', 'studyGroup')
      .leftJoinAndSelect('studyGroup.subjects', 'subjects')
      .leftJoinAndSelect('semesterReport.scores', 'scores')
      .leftJoinAndSelect('scores.subject', 'subject')
      .leftJoinAndSelect(
        'semesterReport.extracurricularScores',
        'extracurricularScores',
      )
      .leftJoinAndSelect(
        'extracurricularScores.extracurricular',
        'extracurricular',
      );
    return await query.getMany();
  }

  async createSemesterReport(body: CreateSemesterReportDto) {
    const {
      absentDays,
      extracurricularScores,
      leaveDays,
      ranking,
      sickDays,
      scores,
      totalScore,
      semester,
      studentNationalId,
    } = body;
    const newSemesterReport = new SemesterReport();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const student: Student = await queryRunner.manager.findOne(Student, {
      where: { studentNationalId: studentNationalId },
      select: { id: true, semesterReports: { id: true, semester: true } },
    });
    if (!student) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('student not found');
    }
    for (let index = 0; index < student.semesterReports.length; index++) {
      const semesterReport = student.semesterReports[index];
      if (semesterReport.semester === semester) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('semester report already exist');
      }
    }
    newSemesterReport.semester = semester;
    const scoreDatas: Score[] = [];
    for (let index = 0; index < scores.length; index++) {
      const score = scores[index];
      const subject = await queryRunner.manager.findOne(Subject, {
        where: { name: score.subjectName },
      });
      if (!subject) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('subject not found');
      }
      const nwScore = new Score();
      nwScore.scoreValue = score.score;
      nwScore.subject = subject;
      nwScore.semesterReport = newSemesterReport;
      scoreDatas.push(nwScore);
    }
    const arrayOfxtracurricularScores: ExtracurricularScore[] = [];
    for (let index = 0; index < extracurricularScores.length; index++) {
      const extracurricularScore = extracurricularScores[index];
      const extracurricular = await queryRunner.manager.findOne(
        Extracurricular,
        { where: { name: extracurricularScore.extracurricularName } },
      );
      if (!extracurricular) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('extracurricular not found');
      }
      const nwScore = new ExtracurricularScore();
      nwScore.extracurricular = extracurricular;
      nwScore.score = extracurricularScore.score;
      nwScore.semesterReport = newSemesterReport;
      arrayOfxtracurricularScores.push(nwScore);
    }
    try {
      newSemesterReport.absentDays = absentDays;
      newSemesterReport.extracurricularScores = arrayOfxtracurricularScores;
      newSemesterReport.scores = scoreDatas;
      newSemesterReport.leaveDays = leaveDays;
      newSemesterReport.ranking = ranking;
      newSemesterReport.sickDays = sickDays;
      newSemesterReport.totalScore = totalScore;
      newSemesterReport.semester = semester;
      newSemesterReport.student = student;
      await queryRunner.manager.save(newSemesterReport);
      await queryRunner.commitTransaction();
      return newSemesterReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    } finally {
      await queryRunner.release();
    }
  }

  async createBatchSemesterReport(batch: CreateBatchSemesterReportDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const { body, schoolYear, semester } = batch;
    const failedId: number[] = [];
    const createSemesterReport: SemesterReport[] = [];
    for (let index = 0; index < body.length; index++) {
      const newSemesterReport = new SemesterReport();
      const element = body[index];
      const {
        absentDays,
        extracurricularScores,
        leaveDays,
        ranking,
        sickDays,
        scores,
        totalScore,
        studentNationalId,
      } = element;
      const student: Student = await queryRunner.manager.findOne(Student, {
        where: { studentNationalId: studentNationalId },
        select: { id: true, semesterReports: { id: true, semester: true } },
        relations: { semesterReports: true },
      });
      if (!student) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('student not found');
      }
      const semesterReport: SemesterReport[] = student.semesterReports;
      for (let index = 0; index < semesterReport.length; index++) {
        const semesterReporta = student.semesterReports[index];
        if (semesterReporta.semester === semester) {
          failedId.push(student.id);
        }
      }
      const scoreDatas: Score[] = [];
      for (let index = 0; index < scores.length; index++) {
        const score = scores[index];
        let subject = await queryRunner.manager.findOne(Subject, {
          where: { name: score.subjectName },
        });
        if (!subject) {
          subject = new Subject();
          subject.name = score.subjectName;
          await queryRunner.manager.save(subject);
        }
        const nwScore = new Score();
        nwScore.scoreValue = score.score;
        nwScore.subject = subject;
        nwScore.semesterReport = newSemesterReport;
        await queryRunner.manager.save(nwScore);
        scoreDatas.push(nwScore);
      }
      const arrayOfxtracurricularScores: ExtracurricularScore[] = [];
      for (let index = 0; index < extracurricularScores.length; index++) {
        const extracurricularScore = extracurricularScores[index];
        let extracurricular = await queryRunner.manager.findOne(
          Extracurricular,
          { where: { name: extracurricularScore.extracurricularName } },
        );
        if (!extracurricular) {
          extracurricular = new Extracurricular();
          extracurricular.name = extracurricularScore.extracurricularName;
          await queryRunner.manager.save(extracurricular);
        }
        const nwScore = new ExtracurricularScore();
        nwScore.extracurricular = extracurricular;
        nwScore.score = extracurricularScore.score;
        nwScore.semesterReport = newSemesterReport;
        await queryRunner.manager.save(nwScore);
        arrayOfxtracurricularScores.push(nwScore);
      }
      newSemesterReport.extracurricularScores = arrayOfxtracurricularScores;
      newSemesterReport.scores = scoreDatas;
      newSemesterReport.absentDays = absentDays;
      newSemesterReport.leaveDays = leaveDays;
      newSemesterReport.schholYear = schoolYear;
      newSemesterReport.averageScore = Number(totalScore) / scoreDatas.length;
      newSemesterReport.ranking = ranking;
      newSemesterReport.sickDays = sickDays;
      newSemesterReport.totalScore = totalScore;
      newSemesterReport.semester = semester;
      newSemesterReport.student = student;
      if (!failedId.includes(newSemesterReport.student.id)) {
        createSemesterReport.push(newSemesterReport);
      }
    }

    try {
      await queryRunner.manager.save(createSemesterReport, { chunk: 1000 });
      await queryRunner.commitTransaction();
      return `${createSemesterReport.length} semester report created but ${failedId.length} failed ids [${failedId.map((d) => `${d},`)}]`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    } finally {
      await queryRunner.release();
    }
  }
}
