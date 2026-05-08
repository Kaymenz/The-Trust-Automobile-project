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
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ListingResponseDto, ListingStatsDto } from '../common/dto/listing-response.dto';
import { ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('Car Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all car listings with filters', description: 'Retrieve car listings with optional filtering by make, model, year, price range, fuel type, etc.' })
  @ApiQuery({ name: 'make', required: false, description: 'Filter by car make' })
  @ApiQuery({ name: 'model', required: false, description: 'Filter by car model' })
  @ApiQuery({ name: 'minYear', required: false, description: 'Minimum year' })
  @ApiQuery({ name: 'maxYear', required: false, description: 'Maximum year' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'fuelType', required: false, description: 'Filter by fuel type' })
  @ApiQuery({ name: 'transmission', required: false, description: 'Filter by transmission type' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully', type: [ListingResponseDto] })
  findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get('makes')
  @ApiOperation({ summary: 'Get all car makes', description: 'Retrieve a list of all available car makes in the system.' })
  @ApiResponse({ status: 200, description: 'List of makes retrieved', type: [String] })
  getMakes() {
    return this.listingsService.getMakes();
  }

  @Get('models')
  @ApiOperation({ summary: 'Get models for a specific make', description: 'Retrieve all models available for a specific car make.' })
  @ApiQuery({ name: 'make', required: true, description: 'Car make to get models for' })
  @ApiResponse({ status: 200, description: 'List of models retrieved', type: [String] })
  @ApiResponse({ status: 400, description: 'Make parameter required', type: ApiErrorResponse })
  getModels(@Query('make') make: string) {
    return this.listingsService.getModels(make);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured listings', description: 'Retrieve all featured car listings.' })
  @ApiResponse({ status: 200, description: 'Featured listings retrieved', type: [ListingResponseDto] })
  getFeatured() {
    return this.listingsService.getFeatured();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get listing statistics', description: 'Get count statistics for listings by status.' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved', type: ListingStatsDto })
  getStats() {
    return this.listingsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single listing by ID', description: 'Retrieve a specific car listing by its ID.' })
  @ApiResponse({ status: 200, description: 'Listing retrieved successfully', type: ListingResponseDto })
  @ApiResponse({ status: 404, description: 'Listing not found', type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new listing', description: 'Create a new car listing. Requires authentication.' })
  @ApiResponse({ status: 201, description: 'Listing created successfully', type: ListingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  create(@Body() createListingDto: any, @Request() req: any) {
    return this.listingsService.create(req.user.userId, createListingDto);
  }

  @Get('my/listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user listings', description: 'Retrieve all listings created by the authenticated user.' })
  @ApiResponse({ status: 200, description: 'User listings retrieved', type: [ListingResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  findMyListings(@Request() req: any) {
    return this.listingsService.findBySeller(req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing', description: 'Update a car listing. Only the owner or admin can update.' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully', type: ListingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Listing not found', type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateListingDto: any, @Request() req: any) {
    return this.listingsService.update(id, req.user.userId, updateListingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing', description: 'Delete a car listing. Only the owner or admin can delete.' })
  @ApiResponse({ status: 204, description: 'Listing deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the owner', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Listing not found', type: ApiErrorResponse })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.remove(id, req.user.userId);
  }

  @Post(':id/feature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Feature a listing (Admin only)', description: 'Mark a listing as featured. Admin access only.' })
  @ApiResponse({ status: 200, description: 'Listing featured successfully', type: ListingResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Listing not found', type: ApiErrorResponse })
  featureListing(@Param('id') id: string) {
    return this.listingsService.update(id, '', { isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
  }
}
