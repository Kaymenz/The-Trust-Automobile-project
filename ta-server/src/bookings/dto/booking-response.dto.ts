import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Renter user ID' })
  renterId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', description: 'Fleet vehicle ID' })
  fleetId: string;

  @ApiProperty({ example: 'Toyota Camry 2023', description: 'Vehicle details' })
  vehicleDetails: string;

  @ApiProperty({ example: '2024-02-15T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2024-02-20T00:00:00.000Z' })
  endDate: Date;

  @ApiProperty({ example: 5000, description: 'Total rental price' })
  totalPrice: number;

  @ApiProperty({ example: 'Confirmed', enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] })
  status: string;

  @ApiProperty({ example: 'GH-2024-02-001', required: false })
  insuranceRef?: string;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  updatedAt: Date;
}
