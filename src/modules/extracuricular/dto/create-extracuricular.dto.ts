import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExtracuricularDto {
  @IsNotEmpty()
  @IsString()
  name?: string;
}
