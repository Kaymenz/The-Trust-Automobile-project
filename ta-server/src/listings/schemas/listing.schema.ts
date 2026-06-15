import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ListingDocument = Listing & Document;

export enum ListingStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  EXPIRED = 'expired',
  DRAFT = 'draft',
}

export enum Transmission {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  CVT = 'cvt',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  LPG = 'lpg',
}

export enum Condition {
  NEW = 'new',
  USED = 'used',
}

@Schema({ timestamps: true })
export class Listing {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  seller: User;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String, enum: ListingStatus, default: ListingStatus.PENDING })
  status: ListingStatus;

  @Prop({ type: String, enum: Condition })
  condition?: Condition;

  @Prop()
  mileage?: number;

  @Prop({ type: String, enum: Transmission })
  transmission?: Transmission;

  @Prop({ type: String, enum: FuelType })
  fuelType?: FuelType;

  @Prop()
  engineSize?: string;

  @Prop()
  color?: string;

  @Prop()
  doors?: number;

  @Prop()
  seats?: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  location?: string;

  @Prop()
  region?: string;

  @Prop({ type: Object })
  sellerContact?: {
    name?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
  };

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  inquiries: number;

  @Prop({ type: Date })
  featuredUntil?: Date;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  negotiable: boolean;

  @Prop({ default: false })
  verified: boolean;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);

// Indexes
ListingSchema.index({ make: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ year: 1 });
ListingSchema.index({ location: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ isFeatured: 1, featuredUntil: 1 });
