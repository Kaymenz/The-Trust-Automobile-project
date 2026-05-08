import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mechanic, MechanicDocument, MechanicStatus } from './schemas/mechanic.schema';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectModel(Mechanic.name) private mechanicModel: Model<MechanicDocument>,
  ) {}

  async create(userId: string, createMechanicDto: any): Promise<Mechanic> {
    const createdMechanic = new this.mechanicModel({
      ...createMechanicDto,
      user: userId,
      status: MechanicStatus.PENDING,
    });
    return createdMechanic.save();
  }

  async findAll(query: any = {}): Promise<Mechanic[]> {
    const filter: any = { status: MechanicStatus.ACTIVE };
    
    if (query.city) filter.city = query.city;
    if (query.specialization) filter.specializations = query.specialization;
    if (query.service) filter.services = query.service;
    if (query.mobile) filter.mobileService = true;
    if (query.emergency) filter.emergencyService = true;
    if (query.search) {
      filter.$or = [
        { workshopName: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    return this.mechanicModel
      .find(filter)
      .populate('user', 'name email phone avatar')
      .sort(query.sort || { rating: -1 })
      .limit(query.limit ? Number(query.limit) : 50)
      .exec();
  }

  async findById(id: string): Promise<Mechanic> {
    const mechanic = await this.mechanicModel
      .findById(id)
      .populate('user', 'name email phone avatar profile')
      .exec();
    
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return mechanic;
  }

  async findByUser(userId: string): Promise<Mechanic | null> {
    return this.mechanicModel
      .findOne({ user: userId })
      .populate('user', 'name email phone avatar')
      .exec();
  }

  async update(id: string, updateMechanicDto: any): Promise<Mechanic> {
    const mechanic = await this.mechanicModel
      .findByIdAndUpdate(id, updateMechanicDto, { new: true })
      .exec();
    
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    return mechanic;
  }

  async remove(id: string): Promise<void> {
    const result = await this.mechanicModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Mechanic not found');
    }
  }

  async getSpecializations(): Promise<string[]> {
    return this.mechanicModel.distinct('specializations', { 
      status: MechanicStatus.ACTIVE 
    });
  }

  async getCities(): Promise<string[]> {
    return this.mechanicModel.distinct('city', { 
      status: MechanicStatus.ACTIVE 
    });
  }

  async findNearby(lat: number, lng: number, maxDistance: number = 10000): Promise<Mechanic[]> {
    return this.mechanicModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      },
      status: MechanicStatus.ACTIVE,
    }).exec();
  }
}
