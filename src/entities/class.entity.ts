import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';
import { StudyGroup } from './study-group.entity';
import { Expose } from 'class-transformer';

@Entity('class')
export class ClassEntity extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  /**
   * Relationship
   */

  @OneToMany(() => Student, (student) => student.studentClass)
  students: Student[];

  @ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.classes)
  @Expose({ name: 'study_group' })
  studyGroup: StudyGroup;
}
