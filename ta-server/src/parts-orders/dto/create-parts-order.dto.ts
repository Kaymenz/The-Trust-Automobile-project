import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreatePartsOrderDto {
  @ApiProperty({
    example: [
      { sparePartId: '507f1f77bcf86cd799439011', quantity: 2, price: 15000 },
      { sparePartId: '507f1f77bcf86cd799439012', quantity: 1, price: 8000 },
    ],
    description: 'Array of spare parts to order',
  })
  @IsArray()
  items: Array<{
    sparePartId: string;
    quantity: number;
    price: number;
  }>;

  @ApiProperty({ example: 23000, description: 'Total order amount' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 'Accra', description: 'Delivery location' })
  @IsString()
  deliveryLocation: string;

  @ApiProperty({
    example: 'Pending',
    description: 'Order status',
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  })
  @IsOptional()
  @IsString()
  status?: string;
}
