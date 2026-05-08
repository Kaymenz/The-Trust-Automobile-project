import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Inquiry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ required: true })
  buyerName: string;

  @Prop({ required: true })
  buyerEmail: string;

  @Prop({ required: false })
  buyerPhone?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Responded', 'Closed'] })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
