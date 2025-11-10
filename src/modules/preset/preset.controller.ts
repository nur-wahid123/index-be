import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  @Patch('update/:id')
  updatePreset(@Param() param: {id: number},@Payload() payload: JwtPayload, @Body() body: CreatePresetDto){
    return this.presetService.updatePreset(Number(param.id), body, Number(payload.sub));
  }
  
  @Post('create')
  createPreset(@Body() body: CreatePresetDto, @Payload() payload: JwtPayload) {
    return this.presetService.createPreset(body, Number(payload.sub));
  }
  
  @Delete('delete/:id')
  deletePreset(@Param() param: {id: number}){
    return this.presetService.deletePreset(Number(param.id));
  }
}
