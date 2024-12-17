import { Roles } from 'src/enums/roles.enum';

export interface JwtPayload {
  username: string;
  name: string;
  sub: number;
  email: string;
  role: Roles;
}
