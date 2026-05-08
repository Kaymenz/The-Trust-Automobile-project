import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SparePartDocument = SparePart & Document;

export enum PartStatus {
  ACTIVE = 'active',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  DRAFT = 'draft',
}

@Schema({ timestamps: true })
export class SparePart {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  dealer: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: String, enum: PartStatus, default: PartStatus.ACTIVE })
  status: PartStatus;

  @Prop()
  brand?: string;

  @Prop()
  partNumber?: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ type: [String], default: [] })
  compatibleMakes: string[];

  @Prop({ type: [String], default: [] })
  compatibleModels: string[];

  @Prop({ type: Object })
  dimensions?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  sales: number;

  @Prop({ default: false })
  genuine: boolean;

  @Prop({ default: false })
  negotiable: boolean;

  @Prop()
  warranty?: string;

  @Prop()
  location?: string;
}

export const SparePartSchema = SchemaFactory.createForClass(SparePart);

// Indexes
SparePartSchema.index({ category: 1 });
SparePartSchema.index({ status: 1 });
SparePartSchema.index({ price: 1 });
SparePartSchema.index({ dealer: 1 });
SparePartSchema.index({ compatibleMakes: 1 });
SparePartSchema.index({ createdAt: -1 });
