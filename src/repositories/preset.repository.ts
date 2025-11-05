import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PresetEntity } from 'src/entities/preset.entity';
import { Order } from 'src/enums/order.enum';
import { PresetQuery } from 'src/modules/preset/dto/preset-query.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PresetRepository extends Repository<PresetEntity> {
  constructor(private readonly datasource: DataSource) {
    super(PresetEntity, datasource.createEntityManager());
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

    qb.orderBy('preset.id', Order.DESC);

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
