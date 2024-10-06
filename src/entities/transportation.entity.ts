import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { Student } from "./student.entity";

@Entity('transportations')
export class Transportation extends BaseEntity {
    @Column({ nullable: false })
    name!: string

    @OneToMany(() => Student, (stundent) => stundent.transportation)
    students: Student[]

}