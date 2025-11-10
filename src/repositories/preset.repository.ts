import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import PresetSettingEntity from 'src/entities/preset-setting.entity';
import { PresetEntity } from 'src/entities/preset.entity';
import { ColumnNameEnum } from 'src/enums/column-name.enum';
import { Order } from 'src/enums/order.enum';
import { CreatePresetDto } from 'src/modules/preset/dto/create-preset.dto';
import { PresetQuery } from 'src/modules/preset/dto/preset-query.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PresetRepository extends Repository<PresetEntity> {
  async deletePreset(id: number) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const preset = await queryRunner.manager.findOne(PresetEntity, {
        where: { id },
        relations: { presetSettings: true },
        select: {
          id: true,
          name: true,
          presetSettings: { id: true, name: true, displayIndex: true },
        },
      });

      if (!preset) {
        throw new InternalServerErrorException('Preset not found');
      }

      if (preset.presetSettings && preset.presetSettings.length > 0) {
        for (const setting of preset.presetSettings) {
          await queryRunner.manager.remove(PresetSettingEntity, setting);
        }
      }

      await queryRunner.manager.remove(PresetEntity, preset);

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePreset(id: number, body: CreatePresetDto, userId: number) {
    const { items, name } = body;
    const queryRunner = this.datasource.createQueryRunner();
    const convertedItems = this.convertColumnNameEnumToPresetSettings(items);

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const preset = await queryRunner.manager.findOne(PresetEntity, {
        where: { id },
        relations: { presetSettings: true },
        select: {
          id: true,
          deletedAt: true,
          deletedBy: true,
          name: true,
          presetSettings: { id: true, name: true, displayIndex: true },
        },
      });

      if (!preset) {
        throw new InternalServerErrorException('Preset not found');
      }

      if (name && name !== preset.name) {
        const existingPreset = await queryRunner.manager.findOne(PresetEntity, {
          where: { name },
          select: { id: true },
        });
        if (existingPreset && existingPreset.id !== preset.id) {
          throw new InternalServerErrorException('Name already exists');
        }
        preset.updatedBy = userId;
        preset.name = name;
      }

      const toDelete = this.getDeleted(convertedItems, preset.presetSettings);

      if (toDelete.length) {
        const namesToDelete = toDelete.map((setting) => setting.name);
        const settingsToRemove = preset.presetSettings.filter((setting) =>
          namesToDelete.includes(setting.name),
        );
        if (settingsToRemove.length) {
          await queryRunner.manager.remove(settingsToRemove);
          preset.presetSettings = preset.presetSettings.filter(
            (setting) => !namesToDelete.includes(setting.name),
          );
        }
      }

      // Add new settings
      const toAdd = this.getAdded(convertedItems, preset.presetSettings);
      let displayIndexOffset = preset.presetSettings.reduce(
        (max, setting) =>
          setting.displayIndex && setting.displayIndex > max
            ? setting.displayIndex
            : max,
        0,
      );

      if (toAdd.length) {
        for (let i = 0; i < toAdd.length; i++) {
          const newSetting = new PresetSettingEntity();
          newSetting.name = toAdd[i].name;
          newSetting.displayIndex = displayIndexOffset + i + 1;
          newSetting.preset = preset;
          newSetting.createdBy = userId;
          await queryRunner.manager.save(newSetting);
          preset.presetSettings.push(newSetting);
        }
      }

      const currentOrder = preset.presetSettings
        .map((setting) => setting.name)
        .join(',');
      const desiredOrder = convertedItems.map((item) => item.name).join(',');

      if (toAdd.length || toDelete.length || currentOrder !== desiredOrder) {
        const nameToDisplayIndex = new Map(
          convertedItems.map((item, idx) => [item.name, idx + 1]),
        );
        preset.presetSettings.forEach((setting) => {
          if (nameToDisplayIndex.has(setting.name)) {
            setting.displayIndex = nameToDisplayIndex.get(setting.name);
          }
        });
        await queryRunner.manager.save(preset.presetSettings);
      }

      await queryRunner.manager.save(preset);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    } finally {
      await queryRunner.release();
    }
  }

  convertColumnNameEnumToPresetSettings(items: ColumnNameEnum[]) {
    return items.map((item, index) => {
      const setting = new PresetSettingEntity();
      setting.name = item;
      setting.displayIndex = index + 1;
      return setting;
    });
  }

  getDeleted(
    items: PresetSettingEntity[],
    presetSettings: PresetSettingEntity[],
  ): PresetSettingEntity[] {
    const itemsNames: (ColumnNameEnum | string)[] = items.map((ps) => ps.name);
    return presetSettings.filter((ps) => !itemsNames.includes(ps.name));
  }

  getAdded(
    items: PresetSettingEntity[],
    presetSettings: PresetSettingEntity[],
  ): PresetSettingEntity[] {
    const currentNames: (ColumnNameEnum | string)[] = presetSettings.map(
      (ps) => ps.name,
    );
    return items.filter((item) => !currentNames.includes(item.name));
  }

  constructor(private readonly datasource: DataSource) {
    super(PresetEntity, datasource.createEntityManager());
  }

  async init() {
    const presets = await this.count();
    if (presets !== 0) return;
    const presetSettings = Object.values(ColumnNameEnum);
    const name = 'Default Preset';
    const preset = new PresetEntity();
    preset.name = name;
    const presetSetting = [];
    for (let index = 0; index < presetSettings.length; index++) {
      const element = presetSettings[index];
      const prSt = new PresetSettingEntity();
      prSt.name = element;
      prSt.displayIndex = index + 1;
      presetSetting.push(prSt);
    }
    preset.presetSettings = presetSetting;
    return await this.savePreset(preset);
  }

  findAll(
    filter: PresetQuery,
    pageOptionsDto: PageOptionsDto,
  ): [any, any] | PromiseLike<[any, any]> {
    const qb = this.datasource.createQueryBuilder(PresetEntity, 'preset');
    const { search } = filter;
    const { page, take, skip } = pageOptionsDto;
    qb.leftJoin('preset.presetSettings', 'presetSettings');
    qb.select([
      'preset.id',
      'preset.name',
      'presetSettings.id',
      'presetSettings.name',
    ]);
    qb.where((qb) => {
      qb.andWhere(
        '(lower(preset.name) like lower(:search) OR lower(presetSettings.name) like lower(:search))',
        { search: `%${search}%` },
      );
    });

    if (page && take) {
      qb.take(take).skip(skip);
    }

    qb.orderBy('preset.id', Order.ASC);

    return qb.getManyAndCount();
  }

  async savePreset(preset: PresetEntity) {
    const qr = this.datasource.createQueryRunner();
    try {
      await qr.connect();
      await qr.startTransaction();
      await qr.manager.save(preset.presetSettings);
      await qr.manager.save(preset);
      await qr.commitTransaction();
      return true;
    } catch (error) {
      await qr.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException('internal server error');
    } finally {
      await qr.release();
    }
  }
}
