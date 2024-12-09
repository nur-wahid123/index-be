import {
  BadRequestException,
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
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { QueryGetStudentDto } from 'src/modules/semester-report/dto/query-get-student.dto';

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

  findOneReport(studentId: number, filterReport: QueryGetStudentDto) {
    try {
      const query = this.dataSource
        .createQueryBuilder(SemesterReport, 'semesterReport')
        .leftJoin('semesterReport.student', 'student')
        .leftJoin('semesterReport.scores', 'scores')
        .leftJoin('scores.subject', 'subject')
        .leftJoin(
          'semesterReport.extracurricularScores',
          'extracurricularScores',
        )
        .leftJoin('extracurricularScores.extracurricular', 'extracurricular')
        .addSelect('student.id')
        .addSelect('student.name')
        .addSelect('subject.id')
        .addSelect('subject.name')
        .addSelect('scores.id')
        .addSelect('scores.scoreValue')
        .addSelect('extracurricularScores.id')
        .addSelect('extracurricularScores.score')
        .addSelect('extracurricular.id')
        .addSelect('extracurricular.name')
        .where((qb) => {
          this.applyFilters(qb, studentId, filterReport);
        });
      return query.getOne();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  applyFilters(
    qb: SelectQueryBuilder<SemesterReport>,
    studentId: number,
    filterReport: QueryGetStudentDto,
  ) {
    const { semester, classType } = filterReport;
    if (studentId) {
      qb.andWhere('student.id = :studentId', { studentId });
    }

    if (semester) {
      qb.andWhere('semesterReport.semester = :semester', { semester });
    }

    if (classType) {
      qb.andWhere('semesterReport.classType = :classType', { classType });
    }
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
    try {
      await queryRunner.startTransaction();
      const student: Student = await queryRunner.manager.findOne(Student, {
        where: { studentNationalId: studentNationalId },
        select: {
          id: true,
          studentClass: { id: true, classType: true },
          semesterReports: { id: true, semester: true },
        },
        relations: { semesterReports: true, studentClass: true },
      });
      if (!student) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('student not found');
      }
      for (let index = 0; index < student.semesterReports.length; index++) {
        const semesterReport = student.semesterReports[index];
        if (
          semesterReport.semester === semester &&
          semesterReport.classType === student.studentClass.classType
        ) {
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
          select: { id: true },
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
          {
            where: { name: extracurricularScore.extracurricularName },
            select: { id: true },
          },
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
      newSemesterReport.absentDays = absentDays;
      newSemesterReport.metadata = {
        class_name: student.studentClass.name ?? '',
        homeroom_teacher: student.studentClass.homeroomTeacher ?? '',
      };
      newSemesterReport.extracurricularScores = arrayOfxtracurricularScores;
      newSemesterReport.scores = scoreDatas;
      newSemesterReport.leaveDays = leaveDays;
      newSemesterReport.ranking = ranking;
      newSemesterReport.sickDays = sickDays;
      newSemesterReport.totalScore = totalScore;
      newSemesterReport.classType = student.studentClass.classType;
      newSemesterReport.semester = semester;
      newSemesterReport.student = student;
      await queryRunner.manager.save(newSemesterReport);
      await queryRunner.commitTransaction();
      return newSemesterReport;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
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
        select: {
          id: true,
          studentClass: {
            id: true,
            classType: true,
            homeroomTeacher: true,
            name: true,
          },
          semesterReports: { id: true, semester: true, classType: true },
        },
        relations: { semesterReports: true, studentClass: true },
      });
      if (!student) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('student not found');
      }
      try {
        const compositeKey = `${semester}-${student.studentClass.classType}`;
        const semesterReportKeys: string[] = student.semesterReports.map(
          (sr) => `${sr.semester}-${sr.classType}`,
        );
        if (semesterReportKeys.includes(compositeKey)) {
          failedId.push(student.id);
          throw new BadRequestException(
            `student already have semester report with composite key ${compositeKey}`,
          );
        }
      } catch (e) {
        console.log(e);
        continue;
      }
      const scoreDatas: Score[] = [];
      for (let index = 0; index < scores.length; index++) {
        const score = scores[index];
        let subject = await queryRunner.manager.findOne(Subject, {
          where: { name: score.subjectName },
          select: { id: true },
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
          {
            where: { name: extracurricularScore.extracurricularName },
            select: { id: true },
          },
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
      newSemesterReport.metadata = {
        class_name: student.studentClass.name ?? '',
        homeroom_teacher: student.studentClass.homeroomTeacher ?? '',
      };
      newSemesterReport.absentDays = absentDays;
      newSemesterReport.classType = student.studentClass.classType;
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
      return {
        message: `${createSemesterReport.length} semester report created but ${failedId.length} failed ids [${failedId.map((d) => `${d},`)}]`,
        failed_ids: failedId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    } finally {
      await queryRunner.release();
    }
  }
}
