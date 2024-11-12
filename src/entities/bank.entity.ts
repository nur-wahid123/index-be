import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';

@Entity('banks')
export class Bank extends BaseEntity {
  @Column({ nullable: false })
  name!: string;

  @OneToMany(() => Student, (stundent) => stundent.bank)
  students: Student[];
}
