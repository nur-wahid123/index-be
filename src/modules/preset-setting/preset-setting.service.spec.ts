import { Test, TestingModule } from '@nestjs/testing';
import { PresetSettingService } from './preset-setting.service';

describe('PresetSettingService', () => {
  let service: PresetSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresetSettingService],
    }).compile();

    service = module.get<PresetSettingService>(PresetSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
