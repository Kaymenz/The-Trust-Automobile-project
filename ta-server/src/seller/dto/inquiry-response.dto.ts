import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class InquiryResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Listing ID' })
  listingId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', description: 'Buyer user ID' })
  buyerId: string;

  @ApiProperty({ example: 'John Doe', description: 'Buyer name' })
  buyerName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Buyer email' })
  buyerEmail: string;

  @ApiProperty({ example: '+233241234567', description: 'Buyer phone', required: false })
  buyerPhone?: string;

  @ApiProperty({ example: 'Is this vehicle available?', description: 'Inquiry message' })
  message: string;

  @ApiProperty({ example: 'Pending', enum: ['Pending', 'Responded', 'Closed'] })
  status: string;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  updatedAt: Date;
}
