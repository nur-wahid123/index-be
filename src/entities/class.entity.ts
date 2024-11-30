import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Student } from './student.entity';
import { StudyGroup } from './study-group.entity';
import { Expose } from 'class-transformer';
import { ClassType } from './../enums/class-type.enum';

@Entity('class')
export class ClassEntity extends BaseEntity {
  @Column({ nullable: false })
  name?: string;

  /**
   * Relationship
   */

  @OneToMany(() => Student, (student) => student.studentClass)
  students?: Student[];

  @ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.classes)
  @Expose({ name: 'study_group' })
  studyGroup?: StudyGroup;

  @Column({ nullable: false, enum: ClassType, default: ClassType.X })
  @Expose({ name: 'class_type' })
  classType?: ClassType;
}
