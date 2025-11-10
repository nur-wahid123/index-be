import { Test, TestingModule } from '@nestjs/testing';
import { PresetSettingController } from './preset-setting.controller';
import { PresetSettingService } from './preset-setting.service';

describe('PresetSettingController', () => {
  let controller: PresetSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetSettingController],
      providers: [PresetSettingService],
    }).compile();

    controller = module.get<PresetSettingController>(PresetSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
