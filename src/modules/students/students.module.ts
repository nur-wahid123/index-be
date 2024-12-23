import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentRepository } from 'src/repositories/student.repository';
import { SchoolProfileRepository } from 'src/repositories/school-profile.repository';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentRepository, SchoolProfileRepository],
})
export class StudentsModule {}
