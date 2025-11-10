import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Guardian } from './guardian.entity';
import { Parents } from './parents.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Parents, (parent) => parent.job)
  parents?: Parents[];

  @OneToMany(() => Guardian, (guardian) => guardian.job)
  guardians?: Guardian[];
}
