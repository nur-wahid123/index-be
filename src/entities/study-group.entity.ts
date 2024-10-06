import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { Student } from "./student.entity";
import { Subject } from "./subject.entity";

@Entity('study_groups')
export class StudyGroup extends BaseEntity {

    @Column({ nullable: false })
    name!: string

    /**
     * Relations
     */

    @OneToMany(() => Student, (student) => student.studyGroup)
    students: Student[]

    @ManyToMany(() => Subject, (subject) => subject.studyGroups)
    @JoinTable()
    subjects: Subject[]
}