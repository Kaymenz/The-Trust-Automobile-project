import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { InquiryResponseDto } from './dto/inquiry-response.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('inquiries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get seller inquiries',
    description: 'Retrieve all inquiries for listings posted by the authenticated seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Inquiries retrieved successfully',
    type: [InquiryResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only sellers can access this',
    type: ApiErrorResponse,
  })
  getInquiries(@Request() req: any) {
    return this.sellerService.getInquiriesBySeller(req.user.id);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get seller listing analytics',
    description: 'Retrieve analytics for all listings posted by the authenticated seller',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
    type: AnalyticsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only sellers can access this',
    type: ApiErrorResponse,
  })
  getAnalytics(@Request() req: any) {
    return this.sellerService.getAnalyticsBySeller(req.user.id);
  }
}
