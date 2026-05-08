import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Fleet vehicle ID' })
  @IsString()
  fleetId: string;

  @ApiProperty({ example: '2024-02-15', description: 'Booking start date' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-02-20', description: 'Booking end date' })
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: 5000, description: 'Total rental price' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: 'Pending', description: 'Booking status', enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'GH-2024-02-001', description: 'Insurance reference', required: false })
  @IsOptional()
  @IsString()
  insuranceRef?: string;
}
