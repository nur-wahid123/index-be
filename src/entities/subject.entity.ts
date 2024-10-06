import { Column, Entity, ManyToMany } from "typeorm";
import { StudyGroup } from "./study-group.entity";

@Entity('subjects')
export class Subject {

    @Column({ nullable: false })
    name!: string

    /**
     * Relations
     */

    @ManyToMany(() => StudyGroup, (studyGroup) => studyGroup.subjects)
    studyGroups: StudyGroup[]

}