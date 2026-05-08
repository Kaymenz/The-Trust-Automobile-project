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

  async findByRenterId(renterId: string): Promise<Booking[]> {
    try {
      this.logger.debug(`Fetching bookings for renter: ${renterId}`);
      
      const bookings = await this.bookingModel
        .find({ renterId })
        .sort({ createdAt: -1 })
        .exec();
      
      this.logger.debug(`Found ${bookings.length} bookings for renter ${renterId}`);
      return bookings;
    } catch (error) {
      this.logger.error(`Error fetching bookings for renter ${renterId}:`, error);
      throw error;
    }
  }

  async create(
    createBookingDto: CreateBookingDto,
    renterId: string,
  ): Promise<Booking> {
    try {
      // Validate dates
      const startDate = new Date(createBookingDto.startDate);
      const endDate = new Date(createBookingDto.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }

      if (startDate < new Date()) {
        throw new BadRequestException('Start date cannot be in the past');
      }

      if (createBookingDto.totalPrice <= 0) {
        throw new BadRequestException('Total price must be greater than 0');
      }

      this.logger.debug(`Creating booking for renter ${renterId}:`, createBookingDto);

      const booking = new this.bookingModel({
        ...createBookingDto,
        renterId,
        status: createBookingDto.status || 'Pending',
      });

      const savedBooking = await booking.save();
      this.logger.log(`Booking created successfully: ${savedBooking._id}`);
      
      return savedBooking;
    } catch (error) {
      this.logger.error(`Error creating booking for renter ${renterId}:`, error);
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
      const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
      
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
}
