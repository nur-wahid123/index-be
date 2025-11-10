import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { SemesterReport } from './semester.entity';
import { Subject } from './subject.entity';

@Entity()
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal')
  scoreValue?: number;

  @ManyToOne(() => SemesterReport, (semesterReport) => semesterReport.scores)
  semesterReport?: SemesterReport;

  @ManyToOne(() => Subject)
  subject?: Subject;
}
