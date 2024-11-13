import { IsOptional, IsString } from 'class-validator';

export default class QuerySubjectDto {
  @IsOptional()
  @IsString()
  search?: string;
}
