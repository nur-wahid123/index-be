import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassType } from 'src/enums/class-type.enum';

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

  @IsOptional()
  @IsEnum(ClassType)
  @Expose({ name: 'class_type' })
  classType?: ClassType;
}
