import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
