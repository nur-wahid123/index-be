import { SetMetadata } from '@nestjs/common';
import { Roles } from '../../enums/roles.enum';

export const SetRole = (...roles: Roles[]) =>
  SetMetadata('roles', roles.length > 1 ? roles : [roles[0]]);
