import { PartialType } from '@nestjs/mapped-types';
import { CreateExtracuricularDto } from './create-extracuricular.dto';

export class UpdateExtracuricularDto extends PartialType(
  CreateExtracuricularDto,
) {}
