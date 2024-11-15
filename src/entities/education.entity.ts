import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Parents } from './parents.entity';
import { Guardian } from './guardian.entity';

@Entity('educations')
export class Education extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  @OneToMany(() => Parents, (parent) => parent.education)
  parents?: Parents[];

  @OneToMany(() => Guardian, (guardian) => guardian.education)
  guardians?: Guardian[];
}
