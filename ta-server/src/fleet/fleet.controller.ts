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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FleetService } from './fleet.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiErrorResponse } from '../common/dto/api-response.dto';
import { FleetCarResponseDto } from '../common/dto/marketplace-response.dto';

@ApiTags('Rental Fleet')
@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all fleet cars' })
  @ApiResponse({ status: 200, description: 'Fleet cars retrieved successfully', type: [FleetCarResponseDto] })
  findAll(@Query() query: any) {
    return this.fleetService.findAll(query);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available fleet cars' })
  @ApiResponse({ status: 200, description: 'Available fleet cars retrieved successfully', type: [FleetCarResponseDto] })
  findAvailable(@Query() query: any) {
    return this.fleetService.findAvailable(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get fleet car categories' })
  @ApiResponse({ status: 200, description: 'Fleet categories retrieved successfully' })
  getCategories() {
    return this.fleetService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fleet car by ID' })
  @ApiResponse({ status: 200, description: 'Fleet car retrieved successfully', type: FleetCarResponseDto })
  @ApiResponse({ status: 404, description: 'Fleet car not found', type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.fleetService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add fleet car (Admin only)' })
  @ApiResponse({ status: 201, description: 'Fleet car created successfully', type: FleetCarResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  create(@Body() createFleetCarDto: any) {
    return this.fleetService.create(createFleetCarDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update fleet car (Admin only)' })
  @ApiResponse({ status: 200, description: 'Fleet car updated successfully', type: FleetCarResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Fleet car not found', type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateFleetCarDto: any) {
    return this.fleetService.update(id, updateFleetCarDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete fleet car (Admin only)' })
  @ApiResponse({ status: 200, description: 'Fleet car deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Fleet car not found', type: ApiErrorResponse })
  remove(@Param('id') id: string) {
    return this.fleetService.remove(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check car availability' })
  @ApiResponse({ status: 200, description: 'Car availability checked successfully', type: Boolean })
  @ApiResponse({ status: 400, description: 'Invalid date parameters', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Fleet car not found', type: ApiErrorResponse })
  checkAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.fleetService.checkAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
