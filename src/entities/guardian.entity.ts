import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { Education } from "./education.entity";
import { Job } from "./job.entity";
import { Income } from "./income.entity";
import { Student } from "./student.entity";

@Entity('guardians')
export class Guardian extends BaseEntity {
    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true, default: 0 })
    yearOfBirth?: number;

    @ManyToOne(() => Education, (education) => education.guardians, { nullable: true })
    education: Education;

    @ManyToOne(() => Job, (job) => job.guardians, { nullable: true })
    job: Job;

    @ManyToOne(() => Income, (income) => income.guardians, { nullable: true })
    income: Income;

    @Column({ nullable: true, unique: true })
    nik?: string

    @OneToMany(() => Student, (student) => student.guardian)
    students: Student[]
}