import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePartsOrderDto {
  @ApiProperty({
    example: 'Shipped',
    description: 'New order status',
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'TRK-GH-2024-001', description: 'Tracking number', required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
