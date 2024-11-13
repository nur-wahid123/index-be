import { IsOptional, IsString } from 'class-validator';

export class UpdateStudyGroupDto {
  @IsOptional()
  @IsString()
  name: string;
}
