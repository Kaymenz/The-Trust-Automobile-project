import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../schemas/user.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ enum: UserStatus, required: false })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  profile?: {
    businessName?: string;
    description?: string;
    address?: string;
    city?: string;
    region?: string;
  };

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    language?: string;
  };
}
