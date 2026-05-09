import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing' })
  listingId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Fleet' })
  fleetId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Mechanic' })
  mechanicId?: Types.ObjectId;

  @Prop({ required: true, enum: ['test_drive', 'purchase', 'rental', 'service'] })
  type: string;

  @Prop({ required: true })
  vehicleDetails: string;

  @Prop()
  preferredDate?: Date;

  @Prop()
  preferredTime?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop()
  message?: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'cancelled', 'completed'] })
  status: string;

  @Prop()
  insuranceRef?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ listingId: 1 });
BookingSchema.index({ mechanicId: 1 });
BookingSchema.index({ createdAt: -1 });
