import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type MechanicDocument = Mechanic & Document;

export enum MechanicStatus {
  ACTIVE = 'active',
  BUSY = 'busy',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class Mechanic {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  workshopName: string;

  @Prop({ type: String, enum: MechanicStatus, default: MechanicStatus.PENDING })
  status: MechanicStatus;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  region?: string;

  @Prop({ type: [Number], index: '2dsphere' })
  location?: [number, number]; // [longitude, latitude]

  @Prop({ type: [String], default: [] })
  specializations: string[];

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ type: Object })
  workingHours?: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };

  @Prop({ default: false })
  mobileService: boolean;

  @Prop({ default: false })
    emergencyService: boolean;

  @Prop({ default: 0 })
  completedJobs: number;

  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop()
  yearsOfExperience?: number;
}

export const MechanicSchema = SchemaFactory.createForClass(Mechanic);

// Indexes
MechanicSchema.index({ status: 1 });
MechanicSchema.index({ city: 1 });
MechanicSchema.index({ location: '2dsphere' });
MechanicSchema.index({ specializations: 1 });
MechanicSchema.index({ rating: -1 });
