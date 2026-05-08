import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PartsOrdersService } from './parts-orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreatePartsOrderDto } from './dto/create-parts-order.dto';
import { UpdatePartsOrderDto } from './dto/update-parts-order.dto';
import { PartsOrderResponseDto } from './dto/parts-order-response.dto';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('Parts Orders')
@Controller('parts/orders')
export class PartsOrdersController {
  constructor(private readonly partsOrdersService: PartsOrdersService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get dealer part orders',
    description: 'Retrieve all spare part orders placed by the authenticated dealer',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: [PartsOrderResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  getMyOrders(@Request() req: any) {
    return this.partsOrdersService.findByDealerId(req.user.id);
  }

  @Get('my/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get order statistics',
    description: 'Retrieve order statistics for the authenticated dealer',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  getOrderStats(@Request() req: any) {
    return this.partsOrdersService.getOrderStatistics(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get order details',
    description: 'Retrieve details of a specific parts order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    type: PartsOrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  getOrder(@Param('id') id: string) {
    return this.partsOrdersService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new parts order',
    description: 'Create a new order for spare parts',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: PartsOrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  createOrder(
    @Body() createPartsOrderDto: CreatePartsOrderDto,
    @Request() req: any,
  ) {
    return this.partsOrdersService.create(createPartsOrderDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update the status of a spare parts order',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: PartsOrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  updateOrder(
    @Param('id') id: string,
    @Body() updatePartsOrderDto: UpdatePartsOrderDto,
  ) {
    return this.partsOrdersService.update(id, updatePartsOrderDto);
  }
}
