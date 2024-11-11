import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class FilterStudentDto {
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    @Expose({ name: 'nisn' })
    studentSchoolId?: string
}