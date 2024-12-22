import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateStudentClassDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'class_id' })
  classId?: number;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'student_national_id' })
  studentNationalId?: string;
}
