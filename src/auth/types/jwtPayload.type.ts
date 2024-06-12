import { Role } from '@prisma/client';

export type JwtPayload = {
  email: string;
  sub: string;
  role: Role;
};
