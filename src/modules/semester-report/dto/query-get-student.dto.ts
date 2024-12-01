import { IsEnum, IsNotEmpty } from 'class-validator';
import { Semester } from '../../../enums/semester.enum';
import { ClassType } from '../../../enums/class-type.enum';
import { Expose } from 'class-transformer';

export class QueryGetStudentDto {
  @IsNotEmpty()
  @IsEnum(Semester)
  semester: Semester;

  @IsNotEmpty()
  @IsEnum(ClassType)
  @Expose({ name: 'class_type' })
  classType: ClassType;
}
