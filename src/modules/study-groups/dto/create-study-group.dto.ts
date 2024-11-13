import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudyGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
