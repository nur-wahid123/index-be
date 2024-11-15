import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Guardian } from './guardian.entity';
import { Parents } from './parents.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Parents, (parent) => parent.job)
  parents?: Parents[];

  @OneToMany(() => Guardian, (guardian) => guardian.job)
  guardians?: Guardian[];
}
