import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
  RENTER = 'renter',
  MECHANIC = 'mechanic',
  PARTS_DEALER = 'parts_dealer',
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop()
  location?: string;

  @Prop({ type: Object })
  profile?: {
    businessName?: string;
    description?: string;
    address?: string;
    city?: string;
    region?: string;
    verified?: boolean;
    verificationDoc?: string;
  };

  @Prop({ type: [String], default: [] })
  savedCars: string[];

  @Prop({ type: [String], default: [] })
  savedParts: string[];

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ type: Date })
  lastLoginAt?: Date;

  @Prop({ type: Object })
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    language?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
