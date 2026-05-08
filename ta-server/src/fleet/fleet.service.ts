import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FleetCar, FleetCarDocument, FleetCarStatus } from './schemas/fleet-car.schema';

@Injectable()
export class FleetService {
  constructor(
    @InjectModel(FleetCar.name) private fleetCarModel: Model<FleetCarDocument>,
  ) {}

  async create(createFleetCarDto: any): Promise<FleetCar> {
    const createdCar = new this.fleetCarModel(createFleetCarDto);
    return createdCar.save();
  }

  async findAll(query: any = {}): Promise<FleetCar[]> {
    const filter: any = {};
    
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.location) filter.availableLocations = query.location;

    return this.fleetCarModel
      .find(filter)
      .sort(query.sort || { dailyRate: 1 })
      .limit(query.limit ? Number(query.limit) : 50)
      .exec();
  }

  async findAvailable(query: any = {}): Promise<FleetCar[]> {
    return this.findAll({ ...query, status: FleetCarStatus.AVAILABLE });
  }

  async findById(id: string): Promise<FleetCar> {
    const car = await this.fleetCarModel.findById(id).exec();
    if (!car) {
      throw new NotFoundException('Fleet car not found');
    }
    return car;
  }

  async update(id: string, updateFleetCarDto: any): Promise<FleetCar> {
    const car = await this.fleetCarModel
      .findByIdAndUpdate(id, updateFleetCarDto, { new: true })
      .exec();
    
    if (!car) {
      throw new NotFoundException('Fleet car not found');
    }
    return car;
  }

  async remove(id: string): Promise<void> {
    const result = await this.fleetCarModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Fleet car not found');
    }
  }

  async getCategories(): Promise<string[]> {
    return this.fleetCarModel.distinct('category');
  }

  async checkAvailability(id: string, startDate: Date, endDate: Date): Promise<boolean> {
    const car = await this.findById(id);
    if (car.status !== FleetCarStatus.AVAILABLE) {
      return false;
    }
    
    // Check if dates overlap with unavailable dates
    const unavailableDates = car.unavailableDates || [];
    return !unavailableDates.some(date => 
      date >= startDate && date <= endDate
    );
  }
}
