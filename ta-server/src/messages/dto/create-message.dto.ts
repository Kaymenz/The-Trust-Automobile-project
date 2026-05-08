import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Hello, I am interested in your car listing.', description: 'Message content' })
  @IsString()
  content: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Recipient user ID', required: false })
  @IsString()
  @IsOptional()
  recipientId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Related listing ID', required: false })
  @IsString()
  @IsOptional()
  relatedListingId?: string;

  @ApiProperty({ example: 'Inquiry', description: 'Message type', enum: ['Inquiry', 'Follow-up', 'General'] })
  @IsString()
  @IsOptional()
  type?: string;
}
