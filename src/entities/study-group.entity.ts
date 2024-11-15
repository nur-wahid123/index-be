import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Subject } from './subject.entity';
import { ClassEntity } from './class.entity';

@Entity('study_groups')
export class StudyGroup extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  /**
   * Relations
   */

  @ManyToMany(() => Subject, (subject) => subject.studyGroups)
  @JoinTable()
  subjects?: Subject[];

  @OneToMany(() => ClassEntity, (classEntity) => classEntity.studyGroup)
  classes?: ClassEntity[];
}
