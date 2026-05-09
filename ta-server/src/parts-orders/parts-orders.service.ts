import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
      return await this.partsOrderModel
        .find({ dealerId: new Types.ObjectId(dealerId) })
        .populate('buyerId', 'name email')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Error fetching orders for dealer ${dealerId}:`, error);
      throw error;
    }
  }

  async findByBuyerId(buyerId: string): Promise<PartsOrder[]> {
    try {
      return await this.partsOrderModel
        .find({ buyerId: new Types.ObjectId(buyerId) })
        .populate('dealerId', 'name email')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.logger.error(`Error fetching orders for buyer ${buyerId}:`, error);
      throw error;
    }
  }

  async create(
    createPartsOrderDto: CreatePartsOrderDto,
    buyerId: string,
  ): Promise<PartsOrder> {
    try {
      if (!createPartsOrderDto.items || createPartsOrderDto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      const order = new this.partsOrderModel({
        ...createPartsOrderDto,
        buyerId: new Types.ObjectId(buyerId),
        dealerId: new Types.ObjectId(createPartsOrderDto.dealerId),
        status: createPartsOrderDto.status || 'Pending',
        paymentStatus: createPartsOrderDto.paymentStatus || 'Unpaid',
      });

      const savedOrder = await order.save();
      this.logger.log(`Parts order created: ${savedOrder._id} for buyer ${buyerId}`);
      return savedOrder;
    } catch (error) {
      this.logger.error(`Error creating parts order for buyer ${buyerId}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<PartsOrder> {
    const order = await this.partsOrderModel.findById(id)
      .populate('buyerId', 'name email')
      .populate('dealerId', 'name email')
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updatePartsOrderDto: UpdatePartsOrderDto): Promise<PartsOrder> {
    const order = await this.partsOrderModel
      .findByIdAndUpdate(id, updatePartsOrderDto, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<PartsOrder> {
    const order = await this.partsOrderModel
      .findByIdAndUpdate(id, { paymentStatus }, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
