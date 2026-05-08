import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SparePartsService } from './spare-parts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiErrorResponse } from '../common/dto/api-response.dto';
import { SparePartResponseDto } from '../common/dto/marketplace-response.dto';

@ApiTags('Spare Parts')
@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly sparePartsService: SparePartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all spare parts with filters' })
  @ApiResponse({ status: 200, description: 'Spare parts retrieved successfully', type: [SparePartResponseDto] })
  findAll(@Query() query: any) {
    return this.sparePartsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get spare part categories' })
  @ApiResponse({ status: 200, description: 'Spare part categories retrieved successfully' })
  getCategories() {
    return this.sparePartsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spare part by ID' })
  @ApiResponse({ status: 200, description: 'Spare part retrieved successfully', type: SparePartResponseDto })
  @ApiResponse({ status: 404, description: 'Spare part not found', type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.sparePartsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTS_DEALER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create spare part listing' })
  @ApiResponse({ status: 201, description: 'Spare part created successfully', type: SparePartResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Dealer or admin access required', type: ApiErrorResponse })
  create(@Body() createSparePartDto: any, @Request() req: any) {
    return this.sparePartsService.create(req.user.userId, createSparePartDto);
  }

  @Get('my/parts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTS_DEALER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my spare parts' })
  @ApiResponse({ status: 200, description: 'Dealer spare parts retrieved successfully', type: [SparePartResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Dealer or admin access required', type: ApiErrorResponse })
  findMyParts(@Request() req: any) {
    return this.sparePartsService.findByDealer(req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTS_DEALER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update spare part' })
  @ApiResponse({ status: 200, description: 'Spare part updated successfully', type: SparePartResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Dealer or admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Spare part not found', type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateSparePartDto: any, @Request() req: any) {
    return this.sparePartsService.update(id, req.user.userId, updateSparePartDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTS_DEALER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete spare part' })
  @ApiResponse({ status: 200, description: 'Spare part deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Dealer or admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Spare part not found', type: ApiErrorResponse })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.sparePartsService.remove(id, req.user.userId);
  }
}
