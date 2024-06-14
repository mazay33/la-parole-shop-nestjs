import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  id: string;
  email: string;

  @Exclude()
  password: string;

  roles: $Enums.Role[];

  provider: $Enums.Provider;

  @Exclude()
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
