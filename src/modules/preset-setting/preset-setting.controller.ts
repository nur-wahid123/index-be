import { Controller } from '@nestjs/common';
import { PresetSettingService } from './preset-setting.service';

@Controller('preset-setting')
export class PresetSettingController {
  constructor(private readonly presetSettingService: PresetSettingService) {}
}
