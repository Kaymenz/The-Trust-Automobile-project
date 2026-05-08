import { ApiProperty } from '@nestjs/swagger';

export class ListingResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'Toyota' })
  make: string;

  @ApiProperty({ example: 'Camry' })
  model: string;

  @ApiProperty({ example: 2020 })
  year: number;

  @ApiProperty({ example: 'LE' })
  trim?: string;

  @ApiProperty({ example: 45000 })
  price: number;

  @ApiProperty({ example: 'GHS' })
  currency: string;

  @ApiProperty({ example: 'Petrol', enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'] })
  fuelType: string;

  @ApiProperty({ example: 'Automatic', enum: ['Automatic', 'Manual', 'CVT'] })
  transmission: string;

  @ApiProperty({ example: 'White' })
  color: string;

  @ApiProperty({ example: 35000 })
  mileage: number;

  @ApiProperty({ example: 'Accra' })
  location: string;

  @ApiProperty({ example: 'active', enum: ['active', 'pending', 'sold', 'reserved', 'blocked'] })
  status: string;

  @ApiProperty({ example: 'New', enum: ['New', 'Used', 'Certified Pre-Owned'] })
  condition: string;

  @ApiProperty({ example: 'Excellent vehicle with full service history...' })
  description?: string;

  @ApiProperty({ type: [String], example: ['https://example.com/image1.jpg'] })
  images: string[];

  @ApiProperty({ example: false })
  isFeatured: boolean;

  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  seller: string;

  @ApiProperty({ example: 0 })
  views: number;

  @ApiProperty({ example: 0 })
  saves: number;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-20T14:25:00.000Z' })
  updatedAt: Date;
}

export class ListingStatsDto {
  @ApiProperty({ example: 500 })
  total: number;

  @ApiProperty({ example: 350 })
  active: number;

  @ApiProperty({ example: 50 })
  pending: number;

  @ApiProperty({ example: 100 })
  sold: number;
}
