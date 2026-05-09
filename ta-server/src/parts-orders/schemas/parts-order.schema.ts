import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PartsOrder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  dealerId: Types.ObjectId;

  @Prop({
    type: [
      {
        sparePartId: { type: Types.ObjectId, ref: 'SparePart' },
        partName: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
      },
    ],
    required: true,
  })
  items: Array<{
    sparePartId: Types.ObjectId;
    partName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  deliveryLocation: string;

  @Prop({
    default: 'Pending',
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  })
  status: string;

  @Prop({
    default: 'Unpaid',
    enum: ['Unpaid', 'Paid', 'Escrow_Held', 'Released', 'Refunded'],
  })
  paymentStatus: string;

  @Prop({ required: false })
  trackingNumber?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PartsOrderSchema = SchemaFactory.createForClass(PartsOrder);

PartsOrderSchema.index({ buyerId: 1 });
PartsOrderSchema.index({ dealerId: 1 });
PartsOrderSchema.index({ status: 1 });
