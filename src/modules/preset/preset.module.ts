import { Module } from '@nestjs/common';
import { PresetService } from './preset.service';
import { PresetController } from './preset.controller';
import { PresetRepository } from 'src/repositories/preset.repository';

@Module({
  controllers: [PresetController],
  providers: [PresetService, PresetRepository],
})
export class PresetModule {}
