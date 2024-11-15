import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Education } from './education.entity';
import { Job } from './job.entity';
import { Income } from './income.entity';
import { Student } from './student.entity';

@Entity('parents')
export class Parents extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true, default: 0 })
  yearOfBirth?: number;

  @ManyToOne(() => Education, (education) => education.parents, {
    nullable: true,
  })
  education?: Education;

  @ManyToOne(() => Job, (job) => job.parents, { nullable: true })
  job?: Job;

  @ManyToOne(() => Income, (income) => income.parents, { nullable: true })
  income?: Income;

  @Column({ nullable: true, unique: true })
  nik?: string;

  @OneToMany(() => Student, (student) => student.father)
  students?: Student[];
}
