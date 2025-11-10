import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudyGroup } from './study-group.entity';
import { BaseEntity } from './base-entity/base.entity';
import { Expose } from 'class-transformer';

@Entity('subjects')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name?: string;

  /**
   * Relations
   */

  @ManyToMany(() => StudyGroup, (studyGroup) => studyGroup.subjects)
  @Expose({ name: 'study_groups' })
  studyGroups?: StudyGroup[];

  @Column({ nullable: false, default: false })
  @Expose({ name: 'is_primary' })
  isPrimary?: boolean;

  @Column({ nullable: true, unique: true })
  @Expose({ name: 'display_index' })
  displayIndex?: number;
}
