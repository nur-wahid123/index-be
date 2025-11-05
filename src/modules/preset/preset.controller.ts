import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PresetService } from './preset.service';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PresetQuery } from './dto/preset-query.dto';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CreatePresetDto } from './dto/create-preset.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';

@Controller('preset')
@UseGuards(JwtAuthGuard)
export class PresetController {
  constructor(private readonly presetService: PresetService) {}

  @Get('list')
  findPreset(
    @Query() filter: PresetQuery,
    @Query() pageOptionDto: PageOptionsDto,
  ) {
    return this.presetService.findPreset(filter, pageOptionDto);
  }

  @Get('detail/:id')
  findPresetDetail(@Param() param: { id: string }) {
    return this.presetService.findOnePreset(param.id);
  }

  @Post('create')
  createPreset(@Body() body: CreatePresetDto, @Payload() payload: JwtPayload) {
    return this.presetService.createPreset(body, Number(payload.sub));
  }
}
