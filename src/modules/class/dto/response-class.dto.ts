import { PartialType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { ClassEntity } from 'src/entities/class.entity';

export class ResponseClassDto extends PartialType(ClassEntity) {
  @Expose({ name: 'student_count' })
  studentsCount: number;
}
