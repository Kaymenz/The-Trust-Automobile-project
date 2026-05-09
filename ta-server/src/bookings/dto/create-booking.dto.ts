import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Listing ID' })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Fleet vehicle ID' })
  @IsOptional()
  @IsString()
  fleetId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Mechanic ID' })
  @IsOptional()
  @IsString()
  mechanicId?: string;

  @ApiProperty({ example: 'test_drive', description: 'Booking type', enum: ['test_drive', 'purchase', 'rental', 'service'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Toyota Camry 2020', description: 'Vehicle description' })
  @IsString()
  vehicleDetails: string;

  @ApiProperty({ example: '2024-02-15', description: 'Preferred date' })
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiProperty({ example: '10:00 AM', description: 'Preferred time' })
  @IsOptional()
  @IsString()
  preferredTime?: string;

  @ApiProperty({ example: '2024-02-15', description: 'Booking start date (for rentals)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-02-20', description: 'Booking end date (for rentals)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 85000, description: 'Total price' })
  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @ApiProperty({ example: 'I am interested in this car', description: 'Message' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: '+233241234567', description: 'Contact phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'pending', description: 'Booking status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'GH-2024-02-001', description: 'Insurance reference', required: false })
  @IsOptional()
  @IsString()
  insuranceRef?: string;
}
