import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { Student } from "./student.entity";
import { Score } from "./score.entity";

@Entity('semester_reports')
export class SemesterReport extends BaseEntity {

    @Column()
    semester: string;

    @ManyToOne(() => Student, (student) => student.semesterReports)
    student: Student;

    @OneToMany(() => Score, (score) => score.semesterReport)
    scores: Score[];

}