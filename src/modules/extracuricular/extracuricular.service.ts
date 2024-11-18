import { Injectable } from '@nestjs/common';
import { CreateExtracuricularDto } from './dto/create-extracuricular.dto';
import { UpdateExtracuricularDto } from './dto/update-extracuricular.dto';
import { ExtracuricularRepository } from 'src/repositories/extracuricular.repository';
import { FilterDto } from 'src/commons/dto/filter.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';
import { Extracurricular } from 'src/entities/extracurricular.entity';

@Injectable()
export class ExtracuricularService {
  constructor(
    private readonly extracuricularRepository: ExtracuricularRepository,
  ) {}

  create(createExtracuricularDto: CreateExtracuricularDto) {
    const extra = new Extracurricular();
    extra.name = createExtracuricularDto.name;
    return this.extracuricularRepository.save(extra);
  }

  async findAll(filter: FilterDto, pageOptionsDto: PageOptionsDto) {
    const [data, itemCount] = await this.extracuricularRepository.findAll(
      filter,
      pageOptionsDto,
    );

    const meta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(data, meta);
  }

  findOne(id: number) {
    return this.extracuricularRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateExtracuricularDto: UpdateExtracuricularDto) {
    const extra = new Extracurricular();
    extra.id = id;
    extra.name = updateExtracuricularDto.name;
    return this.extracuricularRepository.save(extra);
  }

  remove(id: number) {
    return `This action removes a #${id} extracuricular`;
  }
}
