import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Guardian } from './guardian.entity';
import { Parents } from './parents.entity';

@Entity('incomes')
export class Income extends BaseEntity {
  @Column({ nullable: false })
  name!: string;

  @OneToMany(() => Parents, (parent) => parent.income)
  parents: Parents[];

  @OneToMany(() => Guardian, (guardian) => guardian.income)
  guardians: Guardian[];
}
