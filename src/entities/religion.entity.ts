import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';

@Entity('religions')
export class Religion extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Student, (student) => student.religion, { nullable: true })
  students?: Student[];
}
