import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExtracuricularService } from './extracuricular.service';
import { CreateExtracuricularDto } from './dto/create-extracuricular.dto';
import { UpdateExtracuricularDto } from './dto/update-extracuricular.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { FilterDto } from 'src/commons/dto/filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('extracuricular')
export class ExtracuricularController {
  constructor(private readonly extracuricularService: ExtracuricularService) {}

  @Post('create')
  create(@Body() createExtracuricularDto: CreateExtracuricularDto) {
    return this.extracuricularService.create(createExtracuricularDto);
  }

  @Get('list')
  findAll(@Query() query: FilterDto, @Query() pageOptionsDto: PageOptionsDto) {
    return this.extracuricularService.findAll(query, pageOptionsDto);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.extracuricularService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateExtracuricularDto: UpdateExtracuricularDto,
  ) {
    return this.extracuricularService.update(+id, updateExtracuricularDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.extracuricularService.remove(+id);
  }
}
