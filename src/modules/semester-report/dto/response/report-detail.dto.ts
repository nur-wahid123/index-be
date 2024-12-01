import { SemesterReport } from '../../../../entities/semester.entity';
import { PartialType } from '@nestjs/mapped-types';

export class ReportDetailDto extends PartialType(SemesterReport){
  
}