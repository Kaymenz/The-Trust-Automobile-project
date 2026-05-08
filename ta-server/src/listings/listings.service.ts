import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing, ListingDocument, ListingStatus } from './schemas/listing.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async create(sellerId: string, createListingDto: any): Promise<Listing> {
    const createdListing = new this.listingModel({
      ...createListingDto,
      seller: sellerId,
      status: ListingStatus.PENDING,
    });
    return createdListing.save();
  }

  async findAll(query: any = {}): Promise<Listing[]> {
    const filter: any = { status: ListingStatus.ACTIVE };
    
    if (query.make) filter.make = query.make;
    if (query.model) filter.model = query.model;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    if (query.year) filter.year = Number(query.year);
    if (query.location) filter.location = query.location;
    if (query.transmission) filter.transmission = query.transmission;
    if (query.fuelType) filter.fuelType = query.fuelType;

    return this.listingModel
      .find(filter)
      .populate('seller', 'name email phone avatar')
      .sort(query.sort || { createdAt: -1 })
      .limit(query.limit ? Number(query.limit) : 50)
      .exec();
  }

  async findById(id: string): Promise<Listing> {
    const listing = await this.listingModel
      .findById(id)
      .populate('seller', 'name email phone avatar profile')
      .exec();
    
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment views
    await this.listingModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return listing;
  }

  async findBySeller(sellerId: string): Promise<Listing[]> {
    return this.listingModel
      .find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, sellerId: string, updateListingDto: any): Promise<Listing> {
    const listing = await this.listingModel.findOne({
      _id: id,
      seller: sellerId,
    });

    if (!listing) {
      throw new NotFoundException('Listing not found or you do not have permission');
    }

    return this.listingModel
      .findByIdAndUpdate(id, updateListingDto, { new: true })
      .exec();
  }

  async remove(id: string, sellerId: string): Promise<void> {
    const result = await this.listingModel.findOneAndDelete({
      _id: id,
      seller: sellerId,
    });

    if (!result) {
      throw new NotFoundException('Listing not found or you do not have permission');
    }
  }

  async getMakes(): Promise<string[]> {
    const makes = await this.listingModel.distinct('make', { status: ListingStatus.ACTIVE });
    return makes.sort();
  }

  async getModels(make: string): Promise<string[]> {
    const models = await this.listingModel.distinct('model', { 
      make,
      status: ListingStatus.ACTIVE 
    });
    return models.sort();
  }

  async getFeatured(): Promise<Listing[]> {
    return this.listingModel
      .find({ 
        isFeatured: true, 
        status: ListingStatus.ACTIVE,
        featuredUntil: { $gte: new Date() }
      })
      .limit(8)
      .populate('seller', 'name avatar')
      .exec();
  }

  async getStats(): Promise<any> {
    const total = await this.listingModel.countDocuments({ status: ListingStatus.ACTIVE });
    const sold = await this.listingModel.countDocuments({ status: ListingStatus.SOLD });
    const pending = await this.listingModel.countDocuments({ status: ListingStatus.PENDING });
    
    return { total, sold, pending };
  }
}
