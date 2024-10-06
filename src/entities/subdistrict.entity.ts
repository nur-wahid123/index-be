import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { Student } from "./student.entity";

@Entity('subdistricts')
export class SubDistrict extends BaseEntity {
    @Column({ nullable: false })
    name!: string

    @OneToMany(() => Student, (student) => student.subDistrict)
    students: Student[]
}