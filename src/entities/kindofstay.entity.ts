import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';

@Entity('kind_of_stay')
export class KindOfStay extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Student, (stundent) => stundent.kindOfStay)
  students?: Student[];
}
