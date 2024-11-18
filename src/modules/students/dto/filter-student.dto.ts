import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterStudentDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'nisn' })
  studentSchoolId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Expose({ name: 'class_id' })
  classId?: number;
}
