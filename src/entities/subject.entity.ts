import { Column, Entity, ManyToMany } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { BaseEntity } from './base-entity/base.entity';
import { Expose } from 'class-transformer';

@Entity('subjects')
export class Subject extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  /**
   * Relations
   */

  @ManyToMany(() => StudyGroup, (studyGroup) => studyGroup.subjects)
  @Expose({ name: 'study_groups' })
  studyGroups?: StudyGroup[];

  @Column({ nullable: false, default: false })
  is_primary?: boolean;
}
