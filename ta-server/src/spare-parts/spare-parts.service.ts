import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SparePart, SparePartDocument, PartStatus } from './schemas/spare-part.schema';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectModel(SparePart.name) private sparePartModel: Model<SparePartDocument>,
  ) {}

  async create(dealerId: string, createSparePartDto: any): Promise<SparePart> {
    const createdPart = new this.sparePartModel({
      ...createSparePartDto,
      dealer: dealerId,
    });
    return createdPart.save();
  }

  async findAll(query: any = {}): Promise<SparePart[]> {
    const filter: any = { status: { $ne: PartStatus.DISCONTINUED } };
    
    if (query.category) filter.category = query.category;
    if (query.make) filter.compatibleMakes = query.make;
    if (query.model) filter.compatibleModels = query.model;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    if (query.brand) filter.brand = query.brand;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.sparePartModel
      .find(filter)
      .populate('dealer', 'name email phone profile')
      .sort(query.sort || { createdAt: -1 })
      .limit(query.limit ? Number(query.limit) : 50)
      .exec();
  }

  async findById(id: string): Promise<SparePart> {
    const part = await this.sparePartModel
      .findById(id)
      .populate('dealer', 'name email phone profile')
      .exec();
    
    if (!part) {
      throw new NotFoundException('Spare part not found');
    }

    // Increment views
    await this.sparePartModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return part;
  }

  async findByDealer(dealerId: string): Promise<SparePart[]> {
    return this.sparePartModel
      .find({ dealer: dealerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, dealerId: string, updateSparePartDto: any): Promise<SparePart> {
    const part = await this.sparePartModel.findOne({
      _id: id,
      dealer: dealerId,
    });

    if (!part) {
      throw new NotFoundException('Spare part not found or you do not have permission');
    }

    return this.sparePartModel
      .findByIdAndUpdate(id, updateSparePartDto, { new: true })
      .exec();
  }

  async remove(id: string, dealerId: string): Promise<void> {
    const result = await this.sparePartModel.findOneAndDelete({
      _id: id,
      dealer: dealerId,
    });

    if (!result) {
      throw new NotFoundException('Spare part not found or you do not have permission');
    }
  }

  async getCategories(): Promise<string[]> {
    return this.sparePartModel.distinct('category', { 
      status: { $ne: PartStatus.DISCONTINUED } 
    });
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    await this.sparePartModel.findByIdAndUpdate(id, {
      $inc: { stock: -quantity, sales: quantity },
    });
  }
}
