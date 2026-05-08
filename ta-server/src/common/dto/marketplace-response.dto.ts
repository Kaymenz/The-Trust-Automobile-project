import { ApiProperty } from '@nestjs/swagger';

export class FleetCarSpecsDto {
  @ApiProperty({ example: 'Automatic', required: false })
  transmission?: string;

  @ApiProperty({ example: 'Petrol', required: false })
  fuelType?: string;

  @ApiProperty({ example: '15 km/l', required: false })
  mileage?: string;

  @ApiProperty({ example: 5, required: false })
  seats?: number;

  @ApiProperty({ example: 2, required: false })
  luggage?: number;

  @ApiProperty({ example: true, required: false })
  ac?: boolean;
}

export class FleetCarResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: 'Toyota' })
  make: string;

  @ApiProperty({ example: 'Corolla' })
  model: string;

  @ApiProperty({ example: 2022 })
  year: number;

  @ApiProperty({ example: 80 })
  dailyRate: number;

  @ApiProperty({
    example: 'economy',
    enum: ['economy', 'compact', 'midsize', 'fullsize', 'suv', 'luxury', 'van'],
  })
  category: string;

  @ApiProperty({ example: 'available', enum: ['available', 'rented', 'maintenance', 'reserved'] })
  status: string;

  @ApiProperty({ example: 'https://example.com/fleet/toyota-corolla.jpg', required: false })
  image?: string;

  @ApiProperty({ type: [String], example: ['https://example.com/fleet/1.jpg'] })
  gallery: string[];

  @ApiProperty({ example: 'Comfortable compact sedan for city and intercity travel', required: false })
  description?: string;

  @ApiProperty({ type: [String], example: ['Air Conditioning', 'Bluetooth'] })
  features: string[];

  @ApiProperty({ type: FleetCarSpecsDto, required: false })
  specs?: FleetCarSpecsDto;

  @ApiProperty({ example: 4.6 })
  rating: number;

  @ApiProperty({ example: 128 })
  reviewCount: number;

  @ApiProperty({ example: true })
  withDriver: boolean;

  @ApiProperty({ example: 25, required: false })
  driverRate?: number;

  @ApiProperty({ type: [String], example: ['Accra', 'Kumasi'] })
  availableLocations: string[];

  @ApiProperty({ type: [String], example: ['2026-06-01T00:00:00.000Z'] })
  unavailableDates: Date[];

  @ApiProperty({ example: '2026-01-10T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-15T09:45:00.000Z' })
  updatedAt: Date;
}

export class SparePartDimensionsDto {
  @ApiProperty({ example: 1.2, required: false })
  weight?: number;

  @ApiProperty({ example: 35, required: false })
  length?: number;

  @ApiProperty({ example: 20, required: false })
  width?: number;

  @ApiProperty({ example: 10, required: false })
  height?: number;
}

export class SparePartResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  dealer: string;

  @ApiProperty({ example: 'Brake Pad Set' })
  name: string;

  @ApiProperty({ example: 'Brakes' })
  category: string;

  @ApiProperty({ example: 250 })
  price: number;

  @ApiProperty({ example: 'active', enum: ['active', 'out_of_stock', 'discontinued', 'draft'] })
  status: string;

  @ApiProperty({ example: 'Bosch', required: false })
  brand?: string;

  @ApiProperty({ example: 'BP-12345', required: false })
  partNumber?: string;

  @ApiProperty({ example: 'High-performance ceramic brake pads', required: false })
  description?: string;

  @ApiProperty({ example: 'https://example.com/parts/brake-pad.jpg', required: false })
  image?: string;

  @ApiProperty({ example: 30 })
  stock: number;

  @ApiProperty({ type: [String], example: ['Toyota', 'Honda'] })
  compatibleMakes: string[];

  @ApiProperty({ type: [String], example: ['Corolla', 'Civic'] })
  compatibleModels: string[];

  @ApiProperty({ type: SparePartDimensionsDto, required: false })
  dimensions?: SparePartDimensionsDto;

  @ApiProperty({ example: 240 })
  views: number;

  @ApiProperty({ example: 56 })
  sales: number;

  @ApiProperty({ example: true })
  genuine: boolean;

  @ApiProperty({ example: false })
  negotiable: boolean;

  @ApiProperty({ example: '6 months manufacturer warranty', required: false })
  warranty?: string;

  @ApiProperty({ example: 'Accra', required: false })
  location?: string;

  @ApiProperty({ example: '2026-01-10T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-15T09:45:00.000Z' })
  updatedAt: Date;
}

export class WorkingHourEntryDto {
  @ApiProperty({ example: '08:00' })
  open: string;

  @ApiProperty({ example: '17:00' })
  close: string;

  @ApiProperty({ example: false })
  closed: boolean;
}

export class MechanicWorkingHoursDto {
  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  monday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  tuesday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  wednesday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  thursday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  friday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  saturday?: WorkingHourEntryDto;

  @ApiProperty({ type: WorkingHourEntryDto, required: false })
  sunday?: WorkingHourEntryDto;
}

export class MechanicResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439015' })
  user: string;

  @ApiProperty({ example: 'Precision Auto Works' })
  workshopName: string;

  @ApiProperty({ example: 'active', enum: ['active', 'busy', 'inactive', 'pending'] })
  status: string;

  @ApiProperty({ example: 'Certified specialists in engine diagnostics', required: false })
  description?: string;

  @ApiProperty({ example: 'https://example.com/mechanics/logo.png', required: false })
  logo?: string;

  @ApiProperty({ type: [String], example: ['https://example.com/mechanics/shop1.jpg'] })
  images: string[];

  @ApiProperty({ example: '12 Main Street' })
  address: string;

  @ApiProperty({ example: 'Accra' })
  city: string;

  @ApiProperty({ example: 'Greater Accra', required: false })
  region?: string;

  @ApiProperty({ type: [Number], example: [-0.186964, 5.603717], required: false })
  location?: number[];

  @ApiProperty({ type: [String], example: ['Engine Repair', 'Brake Service'] })
  specializations: string[];

  @ApiProperty({ type: [String], example: ['Diagnostics', 'Battery Service'] })
  services: string[];

  @ApiProperty({ example: 4.8 })
  rating: number;

  @ApiProperty({ example: 96 })
  reviewCount: number;

  @ApiProperty({ type: MechanicWorkingHoursDto, required: false })
  workingHours?: MechanicWorkingHoursDto;

  @ApiProperty({ example: true })
  mobileService: boolean;

  @ApiProperty({ example: false })
  emergencyService: boolean;

  @ApiProperty({ example: 420 })
  completedJobs: number;

  @ApiProperty({ type: [String], example: ['ASE Certified', 'Toyota Master Tech'] })
  certifications: string[];

  @ApiProperty({ example: 8, required: false })
  yearsOfExperience?: number;

  @ApiProperty({ example: '2026-01-10T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-15T09:45:00.000Z' })
  updatedAt: Date;
}
