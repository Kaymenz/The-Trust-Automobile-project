import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FleetCarDocument = FleetCar & Document;

export enum FleetCarStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

export enum CarCategory {
  ECONOMY = 'economy',
  COMPACT = 'compact',
  MIDSIZE = 'midsize',
  FULLSIZE = 'fullsize',
  SUV = 'suv',
  LUXURY = 'luxury',
  VAN = 'van',
}

@Schema({ timestamps: true })
export class FleetCar {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  dailyRate: number;

  @Prop({ type: String, enum: CarCategory, required: true })
  category: CarCategory;

  @Prop({ type: String, enum: FleetCarStatus, default: FleetCarStatus.AVAILABLE })
  status: FleetCarStatus;

  @Prop()
  image?: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: Object })
  specs?: {
    transmission?: string;
    fuelType?: string;
    mileage?: string;
    seats?: number;
    luggage?: number;
    ac?: boolean;
  };

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: false })
  withDriver: boolean;

  @Prop()
  driverRate?: number;

  @Prop({ type: [String], default: [] })
  availableLocations: string[];

  @Prop({ type: [Date], default: [] })
  unavailableDates: Date[];
}

export const FleetCarSchema = SchemaFactory.createForClass(FleetCar);

// Indexes
FleetCarSchema.index({ category: 1 });
FleetCarSchema.index({ status: 1 });
FleetCarSchema.index({ dailyRate: 1 });
FleetCarSchema.index({ availableLocations: 1 });
