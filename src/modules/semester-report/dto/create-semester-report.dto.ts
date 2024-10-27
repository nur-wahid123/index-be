import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf, ValidateNested } from "class-validator";
import { ExtracurricularScoreEnum } from "src/enums/extracurricular-score.enum";
import { Semester } from "src/enums/semester.enum";

export class CreateBatchSemesterReportDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSemesterReportDto)
    body!: CreateSemesterReportDto[]

    @IsNotEmpty()
    @IsString()
    schoolYear!:string

    @IsNotEmpty()
    @IsEnum(Semester)
    semester!: Semester;

}

export class CreateSemesterReportDto {

    @IsNotEmpty()
    @IsString()
    studentNationalId!: string;
    
    @IsNotEmpty()
    @IsString()
    schoolYear!:string
    
    @IsNotEmpty()
    @IsArray()
    @Type(() => Score)
    scores!: Score[];
    
    @IsNotEmpty()
    @IsArray()
    @Type(() => ExtracurricularScore)
    extracurricularScores!: ExtracurricularScore[];
    
    @IsNotEmpty()
    @IsNumber()
    totalScore!: number;
    
    @IsNotEmpty()
    @IsNumber()
    ranking!: number;
    
    @IsNotEmpty()
    @IsNumber()
    sickDays: number;
    
    @IsNotEmpty()
    @IsNumber()
    absentDays: number;
    
    @IsNotEmpty()
    @IsNumber()
    leaveDays: number;
    
    @IsNotEmpty()
    @IsEnum(Semester)
    semester!: Semester;
}

class Score {
    @IsNotEmpty()
    @IsString()
    subjectName!: string;

    @IsNotEmpty()
    @IsNumber()
    score!: number;
}

class ExtracurricularScore {
    @IsNotEmpty()
    @IsString()
    extracurricularName!: string;

    @IsNotEmpty()
    @IsEnum(ExtracurricularScoreEnum)
    score!: ExtracurricularScoreEnum;
}