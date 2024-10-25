import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';
import { Score } from './score.entity';
import { Expose } from 'class-transformer';

@Entity('semester_reports')
export class SemesterReport extends BaseEntity {
  @Column()
  semester: string;

  @ManyToOne(() => Student, (student) => student.semesterReports)
  student: Student;

  @OneToMany(() => Score, (score) => score.semesterReport)
  scores: Score[];

  @Column({ nullable: true })
  @Expose({ name: 'schhol_year' })
  schholYear: number;

  @Column({ nullable: false })
  @Expose({ name: 'total_score' })
  totalScore: number;

  @Column({ nullable: true, type: 'decimal' })
  @Expose({ name: 'average_score' })
  averageScore: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'sick_days' })
  sickDays: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'absent_days' })
  absentDays: number;

  @Column({ nullable: false, default: 0 })
  @Expose({ name: 'leave_days' })
  leaveDays: number;

  @Column({ nullable: false, default: 0 })
  ranking: number;
}
