import { ExtracurricularScoreEnum } from "./../enums/extracurricular-score.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { SemesterReport } from "./semester.entity";
import { BaseEntity } from "./base-entity/base.entity";
import { Extracurricular } from "./extracurricular.entity";

@Entity()
export class ExtracurricularScore extends BaseEntity {
    @Column({ nullable: false, enum: ExtracurricularScoreEnum })
    score!: ExtracurricularScoreEnum;

    @ManyToOne(() => SemesterReport)
    semesterReport: SemesterReport

    @ManyToOne(() => Extracurricular)
    extracurricular: Extracurricular

}