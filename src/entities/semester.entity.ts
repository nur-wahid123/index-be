import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';
import { Score } from './score.entity';
import { Expose } from 'class-transformer';
import { ExtracurricularScore } from './extracurricular-score.entity';
import { Semester } from './../enums/semester.enum';
import { ClassType } from './../enums/class-type.enum';

@Entity('semester_reports')
export class SemesterReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: Semester, nullable: false })
  semester?: Semester;

  @ManyToOne(() => Student, (student) => student.semesterReports)
  student?: Student;

  @OneToMany(() => Score, (score) => score.semesterReport)
  scores?: Score[];

  @OneToMany(
    () => ExtracurricularScore,
    (extracurricularScore) => extracurricularScore.semesterReport,
  )
  @Expose({ name: 'extracurricular_scores' })
  extracurricularScores?: ExtracurricularScore[];

  @Column({ nullable: false, type: 'varchar' })
  @Expose({ name: 'schhol_year' })
  schholYear?: string;

  @Column({ nullable: false })
  @Expose({ name: 'total_score' })
  totalScore?: number;

  @Column({ nullable: true, type: 'decimal' })
  @Expose({ name: 'average_score' })
  averageScore?: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'sick_days' })
  sickDays?: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'absent_days' })
  absentDays?: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'leave_days' })
  leaveDays?: number;

  @Column({ nullable: false, default: 0 })
  ranking?: number;

  @Column({ nullable: false, enum: ClassType })
  @Expose({ name: 'class_type' })
  classType?: ClassType;

  @Column({ nullable: true, type: 'jsonb' })
  metadata?: object;
}
