import { Module } from '@nestjs/common';
import { ExtracuricularService } from './extracuricular.service';
import { ExtracuricularController } from './extracuricular.controller';
import { ExtracuricularRepository } from 'src/repositories/extracuricular.repository';

@Module({
  controllers: [ExtracuricularController],
  providers: [ExtracuricularService, ExtracuricularRepository],
})
export class ExtracuricularModule {}
