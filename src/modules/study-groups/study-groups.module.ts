import { Module } from '@nestjs/common';
import { StudyGroupsService } from './study-groups.service';
import { StudyGroupsController } from './study-groups.controller';
import { StudyGroupRepository } from 'src/repositories/study-group.repository';

@Module({
  controllers: [StudyGroupsController],
  providers: [StudyGroupsService, StudyGroupRepository],
})
export class StudyGroupsModule {}
