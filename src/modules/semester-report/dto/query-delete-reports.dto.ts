import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Semester } from 'src/enums/semester.enum';

export class QueryDeleteReportDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'class_name' })
  className?: string;

  @IsOptional()
  @IsEnum(Semester)
  semester?: Semester;
}
