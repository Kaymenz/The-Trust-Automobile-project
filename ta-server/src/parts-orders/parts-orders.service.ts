import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PartsOrder } from './schemas/parts-order.schema';
import { CreatePartsOrderDto } from './dto/create-parts-order.dto';
import { UpdatePartsOrderDto } from './dto/update-parts-order.dto';

@Injectable()
export class PartsOrdersService {
  private readonly logger = new Logger(PartsOrdersService.name);

  constructor(
    @InjectModel(PartsOrder.name) private partsOrderModel: Model<PartsOrder>,
  ) {}

  async findByDealerId(dealerId: string): Promise<PartsOrder[]> {
    try {
      this.logger.debug(`Fetching orders for dealer: ${dealerId}`);

      const orders = await this.partsOrderModel
        .find({ dealerId })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.debug(`Found ${orders.length} orders for dealer ${dealerId}`);
      return orders;
    } catch (error) {
      this.logger.error(
        `Error fetching orders for dealer ${dealerId}:`,
        error
      );
      throw error;
    }
  }

  async create(
    createPartsOrderDto: CreatePartsOrderDto,
    dealerId: string,
  ): Promise<PartsOrder> {
    try {
      // Validate items
      if (!createPartsOrderDto.items || createPartsOrderDto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      // Validate total amount
      if (createPartsOrderDto.totalAmount <= 0) {
        throw new BadRequestException('Total amount must be greater than 0');
      }

      // Calculate expected total from items
      const calculatedTotal = createPartsOrderDto.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      if (Math.abs(calculatedTotal - createPartsOrderDto.totalAmount) > 100) {
        this.logger.warn(
          `Total amount mismatch. Expected: ${calculatedTotal}, Provided: ${createPartsOrderDto.totalAmount}`
        );
      }

      // Validate delivery location
      if (!createPartsOrderDto.deliveryLocation || createPartsOrderDto.deliveryLocation.trim() === '') {
        throw new BadRequestException('Delivery location is required');
      }

      this.logger.debug(`Creating parts order for dealer ${dealerId}:`, createPartsOrderDto);

      const order = new this.partsOrderModel({
        ...createPartsOrderDto,
        dealerId,
        status: createPartsOrderDto.status || 'Pending',
      });

      const savedOrder = await order.save();
      this.logger.log(`Parts order created successfully: ${savedOrder._id}`);

      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating parts order for dealer ${dealerId}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<PartsOrder> {
    try {
      const order = await this.partsOrderModel.findById(id).exec();

      if (!order) {
        throw new NotFoundException('Parts order not found');
      }

      return order;
    } catch (error) {
      this.logger.error(`Error fetching parts order ${id}:`, error);
      throw error;
    }
  }

  async update(
    id: string,
    updatePartsOrderDto: UpdatePartsOrderDto,
  ): Promise<PartsOrder> {
    try {
      const validStatuses = [
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled',
      ];

      if (
        updatePartsOrderDto.status &&
        !validStatuses.includes(updatePartsOrderDto.status)
      ) {
        throw new BadRequestException(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        );
      }

      this.logger.debug(
        `Updating parts order ${id}:`,
        updatePartsOrderDto
      );

      const order = await this.partsOrderModel
        .findByIdAndUpdate(id, updatePartsOrderDto, { new: true })
        .exec();

      if (!order) {
        throw new NotFoundException('Parts order not found');
      }

      this.logger.log(`Parts order ${id} updated successfully`);
      return order;
    } catch (error) {
      this.logger.error(`Error updating parts order ${id}:`, error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<PartsOrder[]> {
    try {
      this.logger.debug(`Fetching orders with status: ${status}`);

      const orders = await this.partsOrderModel
        .find({ status })
        .sort({ createdAt: -1 })
        .exec();

      return orders;
    } catch (error) {
      this.logger.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  }

  async getOrderStatistics(dealerId: string): Promise<any> {
    try {
      this.logger.debug(`Calculating order statistics for dealer: ${dealerId}`);

      const orders = await this.partsOrderModel.find({ dealerId }).exec();

      const statistics = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        byStatus: {
          pending: orders.filter((o) => o.status === 'Pending').length,
          confirmed: orders.filter((o) => o.status === 'Confirmed').length,
          shipped: orders.filter((o) => o.status === 'Shipped').length,
          delivered: orders.filter((o) => o.status === 'Delivered').length,
          cancelled: orders.filter((o) => o.status === 'Cancelled').length,
        },
        averageOrderValue:
          orders.length > 0
            ? orders.reduce((sum, order) => sum + order.totalAmount, 0) /
              orders.length
            : 0,
      };

      this.logger.debug(
        `Statistics calculated for dealer ${dealerId}:`,
        statistics
      );
      return statistics;
    } catch (error) {
      this.logger.error(
        `Error calculating statistics for dealer ${dealerId}:`,
        error
      );
      throw error;
    }
  }
}
