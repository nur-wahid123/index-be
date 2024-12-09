import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ClassType } from 'src/enums/class-type.enum';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'homeroom_teacher' })
  homeroomTeacher: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'study_group_id' })
  studyGroupId: number;

  @IsNotEmpty()
  @IsEnum(ClassType)
  @Expose({ name: 'class_type' })
  classType?: ClassType;
}
