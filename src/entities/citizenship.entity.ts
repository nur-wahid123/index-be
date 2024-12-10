import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity('citizenships')
export class Citizenship extends BaseEntity {
  @Column({ nullable: false })
  name?: string;
}
