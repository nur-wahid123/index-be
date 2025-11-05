import { Module } from '@nestjs/common';
import { PresetSettingService } from './preset-setting.service';
import { PresetSettingController } from './preset-setting.controller';

@Module({
  controllers: [PresetSettingController],
  providers: [PresetSettingService],
})
export class PresetSettingModule {}
