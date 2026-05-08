import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  renterId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Fleet', required: true })
  fleetId: Types.ObjectId;

  @Prop({ required: true })
  vehicleDetails: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'Pending', enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] })
  status: string;

  @Prop({ required: false })
  insuranceRef?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
