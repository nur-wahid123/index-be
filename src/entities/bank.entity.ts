import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';

@Entity('banks')
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Student, (stundent) => stundent.bank)
  students?: Student[];
}
