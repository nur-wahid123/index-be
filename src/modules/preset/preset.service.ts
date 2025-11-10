import { BadRequestException, Injectable } from '@nestjs/common';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PresetQuery } from './dto/preset-query.dto';
import { CreatePresetDto } from './dto/create-preset.dto';
import { PresetRepository } from 'src/repositories/preset.repository';
import { PresetEntity } from 'src/entities/preset.entity';
import PresetSettingEntity from 'src/entities/preset-setting.entity';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';
import { Order } from 'src/enums/order.enum';

@Injectable()
export class PresetService {
  deletePreset(id: number) {
    return this.presetRepository.deletePreset(id);
  }

  updatePreset(id: number, body: CreatePresetDto, userId: number) {
    return this.presetRepository.updatePreset(id, body, userId);
  }

  constructor(private readonly presetRepository: PresetRepository) {}

  async checkNames(name: string) {
    const data = await this.presetRepository.findOne({
      where: {
        name,
      },
      select: {
        id: true,
      },
    });
    if (data) {
      throw new BadRequestException('Name Already Exists');
    }
  }

  async createPreset(body: CreatePresetDto, userId: number) {
    const { name, items } = body;
    await this.checkNames(name);
    const preset = new PresetEntity();
    preset.name = name;
    const presetSettings: PresetSettingEntity[] = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const presetSetting = new PresetSettingEntity();
      presetSetting.name = item;
      presetSetting.displayIndex = index + 1;
      presetSettings.push(presetSetting);
    }
    preset.presetSettings = presetSettings;
    preset.createdBy = userId;
    return this.presetRepository.savePreset(preset);
  }

  async findOnePreset(id: string) {
    // Query preset by id, selecting only id and name fields for both preset and its settings
    return this.presetRepository.findOne({
      where: {
        id: +id,
      },
      relations: ['presetSettings'],
      select: {
        id: true,
        name: true,
        presetSettings: {
          id: true,
          name: true,
          displayIndex: true,
        },
      },
      order: {
        id: Order.ASC,
        presetSettings: { displayIndex: Order.ASC },
      },
    });
  }

  async findPreset(filter: PresetQuery, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.presetRepository.findAll(
      filter,
      pageOptionsDto,
    );
    const meta = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(data, meta);
  }
}
