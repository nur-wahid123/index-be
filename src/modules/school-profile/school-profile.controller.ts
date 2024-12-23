import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SchoolProfileService } from './school-profile.service';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { updateSchoolProfileDto } from './dto/update-school-profile.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { SetRole } from 'src/commons/decorators/role.decorator';
import { Roles } from 'src/enums/roles.enum';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';

@UseInterceptors(ResponseInterceptor)
@Controller('school-profile')
export class SchoolProfileController {
  constructor(private readonly schoolProfileService: SchoolProfileService) {}

  @Get('data')
  getProfile() {
    return this.schoolProfileService.getProfile();
  }

  @UseGuards(JwtAuthGuard)
  @SetRole(Roles.SUPERADMIN)
  @Patch('update')
  updateProfile(
    @Body() updateSchoolProfileDto: updateSchoolProfileDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.schoolProfileService.updateProfile(
      updateSchoolProfileDto,
      +payload.sub,
    );
  }
}
