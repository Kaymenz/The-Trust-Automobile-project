import {
  Controller, Get, Post, Body, Patch, Param,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PartsOrdersService } from './parts-orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreatePartsOrderDto } from './dto/create-parts-order.dto';
import { UpdatePartsOrderDto } from './dto/update-parts-order.dto';

@ApiTags('Parts Orders')
@Controller('parts-orders')
export class PartsOrdersController {
  constructor(private readonly partsOrdersService: PartsOrdersService) {}

  @Get('my-purchases')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders made by me' })
  getMyPurchases(@Request() req: any) {
    return this.partsOrdersService.findByBuyerId(req.user.id);
  }

  @Get('my-sales')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders received as a dealer' })
  getMySales(@Request() req: any) {
    return this.partsOrdersService.findByDealerId(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order details' })
  getOrder(@Param('id') id: string) {
    return this.partsOrdersService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new parts order' })
  createOrder(@Body() createOrderDto: CreatePartsOrderDto, @Request() req: any) {
    return this.partsOrdersService.create(createOrderDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdatePartsOrderDto) {
    return this.partsOrdersService.update(id, updateOrderDto);
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment status' })
  updatePayment(@Param('id') id: string, @Body() body: { paymentStatus: string }) {
    return this.partsOrdersService.updatePaymentStatus(id, body.paymentStatus);
  }
}
