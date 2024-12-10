import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity('type_of_bloods')
export class TypeOfBlood extends BaseEntity {
  @Column({ nullable: false })
  name?: string;
}
