import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/commons/dto/filter.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { Extracurricular } from 'src/entities/extracurricular.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ExtracuricularRepository extends Repository<Extracurricular> {
  constructor(private readonly dataSource: DataSource) {
    super(Extracurricular, dataSource.createEntityManager());
  }

  findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const { page, skip, take, order } = pageOptionsDto;
    const query = this.dataSource
      .createQueryBuilder(Extracurricular, 'extracurricular')
      .where((qb) => {
        const { search } = filter;
        if (search) {
          qb.andWhere('extracurricular.name LIKE :search', {
            search: `%${search}%`,
          });
        }
      });

    if (page && take) {
      query.skip(skip).take(take);
    }
    query.orderBy('extracurricular.id', order);
    return query.getManyAndCount();
  }
}
