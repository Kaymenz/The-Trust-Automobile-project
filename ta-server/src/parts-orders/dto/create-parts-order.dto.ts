import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreatePartsOrderDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Dealer ID' })
  @IsString()
  dealerId: string;

  @ApiProperty({
    example: [
      { sparePartId: '507f1f77bcf86cd799439011', partName: 'Brake Pads', quantity: 2, price: 15000, subtotal: 30000 },
    ],
    description: 'Array of spare parts to order',
  })
  @IsArray()
  items: Array<{
    sparePartId: string;
    partName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;

  @ApiProperty({ example: 30000, description: 'Total order amount' })
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

  @ApiProperty({
    example: 'Unpaid',
    description: 'Payment status',
    enum: ['Unpaid', 'Paid', 'Escrow_Held', 'Released', 'Refunded'],
  })
  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
