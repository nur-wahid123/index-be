import { Module } from '@nestjs/common';
import { SchoolProfileService } from './school-profile.service';
import { SchoolProfileController } from './school-profile.controller';
import { SchoolProfileRepository } from 'src/repositories/school-profile.repository';

@Module({
  controllers: [SchoolProfileController],
  providers: [SchoolProfileService, SchoolProfileRepository],
})
export class SchoolProfileModule {}
