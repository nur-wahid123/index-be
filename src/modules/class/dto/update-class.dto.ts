import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClassType } from 'src/enums/class-type.enum';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Expose({ name: 'study_group_id' })
  studyGroupId?: number;

  @IsOptional()
  @IsEnum(ClassType)
  @Expose({ name: 'class_type' })
  classType?: ClassType;
}
