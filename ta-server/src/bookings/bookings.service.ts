import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async findByUserId(userId: string): Promise<Booking[]> {
    try {
      this.logger.debug(`Fetching bookings for user: ${userId}`);
      const bookings = await this.bookingModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();
      this.logger.debug(`Found ${bookings.length} bookings for user ${userId}`);
      return bookings;
    } catch (error) {
      this.logger.error(`Error fetching bookings for user ${userId}:`, error);
      throw error;
    }
  }

  // Legacy compat — alias for old renter-based queries
  async findByRenterId(renterId: string): Promise<Booking[]> {
    return this.findByUserId(renterId);
  }

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    try {
      // For rentals, validate dates
      if (createBookingDto.type === 'rental') {
        if (!createBookingDto.startDate || !createBookingDto.endDate) {
          throw new BadRequestException('Start and end dates are required for rentals');
        }
        const startDate = new Date(createBookingDto.startDate);
        const endDate = new Date(createBookingDto.endDate);
        if (startDate >= endDate) {
          throw new BadRequestException('End date must be after start date');
        }
      }

      // For purchases, validate listing and price
      if (createBookingDto.type === 'purchase' && !createBookingDto.listingId) {
        throw new BadRequestException('Listing ID is required for purchase bookings');
      }

      // Check for duplicate active bookings on same listing
      if (createBookingDto.listingId) {
        const existing = await this.bookingModel.findOne({
          userId,
          listingId: createBookingDto.listingId,
          type: createBookingDto.type,
          status: { $in: ['pending', 'confirmed'] },
        });
        if (existing) {
          throw new BadRequestException(
            `You already have an active ${createBookingDto.type.replace('_', ' ')} request for this vehicle.`
          );
        }
      }

      this.logger.debug(`Creating ${createBookingDto.type} booking for user ${userId}:`, createBookingDto);

      const booking = new this.bookingModel({
        ...createBookingDto,
        userId,
        status: createBookingDto.status || 'pending',
      });

      const savedBooking = await booking.save();
      this.logger.log(`Booking created: ${savedBooking._id} (${createBookingDto.type})`);
      return savedBooking;
    } catch (error) {
      this.logger.error(`Error creating booking for user ${userId}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<Booking> {
    try {
      const booking = await this.bookingModel.findById(id).exec();
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      return booking;
    } catch (error) {
      this.logger.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  }

  async updateStatus(id: string, status: string): Promise<Booking> {
    try {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      this.logger.debug(`Updating booking ${id} status to: ${status}`);
      const booking = await this.bookingModel
        .findByIdAndUpdate(id, { status }, { new: true })
        .exec();

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      this.logger.log(`Booking ${id} status updated to ${status}`);
      return booking;
    } catch (error) {
      this.logger.error(`Error updating booking ${id} status:`, error);
      throw error;
    }
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }
    if (['cancelled', 'completed'].includes(booking.status)) {
      throw new BadRequestException('This booking cannot be cancelled');
    }
    return this.updateStatus(id, 'cancelled');
  }
}
