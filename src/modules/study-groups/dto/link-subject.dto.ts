import { Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class LinkSubjectDto {
    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'study_group_id' })
    studyGroupId: number

    @IsNotEmpty()
    @IsNumber()
    @Expose({ name: 'subject_id' })
    subjectId: number
}

export class BatchLinkSubjectDto {
    @IsNotEmpty()
    @Expose({ name: 'study_group_id' })
    studyGroupId: number

    @IsNotEmpty()
    @IsArray()
    @Expose({ name: 'subjects_id' })
    @Type(() => Number)
    subjectsId: number[]
}