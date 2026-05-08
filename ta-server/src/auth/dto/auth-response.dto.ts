import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../../users/schemas/user.schema';

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
  };
}
