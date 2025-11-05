import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';

@Entity('type_of_bloods')
export class TypeOfBlood extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name?: string;
}
