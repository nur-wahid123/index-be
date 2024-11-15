import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity('extracurriculars')
export class Extracurricular extends BaseEntity {
  @Column({ nullable: false })
  name?: string;
}
