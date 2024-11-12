import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentRepository } from 'src/repositories/student.repository';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository],
})
export class StudentsModule {}
