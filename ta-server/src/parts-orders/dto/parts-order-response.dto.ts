import { ApiProperty } from '@nestjs/swagger';

export class PartsOrderResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Dealer/Buyer user ID' })
  dealerId: string;

  @ApiProperty({
    example: [
      {
        sparePartId: '507f1f77bcf86cd799439013',
        partName: 'Oil Filter',
        quantity: 2,
        price: 15000,
        subtotal: 30000,
      },
    ],
    description: 'Order line items',
  })
  items: Array<{
    sparePartId: string;
    partName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;

  @ApiProperty({ example: 23000, description: 'Total order amount' })
  totalAmount: number;

  @ApiProperty({ example: 'Accra', description: 'Delivery location' })
  deliveryLocation: string;

  @ApiProperty({
    example: 'Confirmed',
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  })
  status: string;

  @ApiProperty({ example: 'TRK-GH-2024-001', description: 'Tracking number', required: false })
  trackingNumber?: string;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-16T14:25:00.000Z' })
  updatedAt: Date;
}
