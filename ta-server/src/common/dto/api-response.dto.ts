import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ example: 'Validation failed' })
  error?: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({
    example: {
      id: '507f1f77bcf86cd799439011',
      name: 'Kwame Asante',
      email: 'kwame@example.com',
      role: 'buyer',
      status: 'active',
      avatar: null,
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar?: string;
  };
}

export class UserResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'Kwame Asante' })
  name: string;

  @ApiProperty({ example: 'kwame@example.com' })
  email: string;

  @ApiProperty({ example: 'buyer', enum: ['admin', 'buyer', 'seller', 'renter', 'mechanic', 'parts_dealer'] })
  role: string;

  @ApiProperty({ example: 'active', enum: ['active', 'pending', 'blocked', 'suspended'] })
  status: string;

  @ApiProperty({ example: '+233241234567', required: false })
  phone?: string;

  @ApiProperty({ example: 'avatar.jpg', required: false })
  avatar?: string;

  @ApiProperty({ example: 'Accra', required: false })
  location?: string;

  @ApiProperty({ required: false })
  profile?: {
    businessName?: string;
    description?: string;
    address?: string;
    city?: string;
    region?: string;
    verified?: boolean;
  };

  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: false })
  phoneVerified: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T14:25:00.000Z' })
  updatedAt: Date;
}

export class SuccessMessageDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

export class UserStatsDto {
  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 120 })
  active: number;

  @ApiProperty({ example: 20 })
  pending: number;

  @ApiProperty({ example: 10 })
  blocked: number;
}
