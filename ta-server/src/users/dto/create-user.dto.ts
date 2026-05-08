import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'Kwame Asante' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'kwame@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ enum: UserStatus, default: UserStatus.PENDING })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ example: '+233241234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Accra', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  profile?: {
    businessName?: string;
    description?: string;
    address?: string;
    city?: string;
    region?: string;
    verified?: boolean;
  };
}
