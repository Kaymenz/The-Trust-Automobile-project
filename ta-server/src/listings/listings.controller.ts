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
  @ApiOperation({ summary: 'Get all car listings with filters' })
  @ApiQuery({ name: 'make', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'minYear', required: false })
  @ApiQuery({ name: 'maxYear', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'fuelType', required: false })
  @ApiQuery({ name: 'transmission', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiResponse({ status: 200, type: [ListingResponseDto] })
  findAll(@Query() query: any) {
    return this.listingsService.findAll(query);
  }

  @Get('makes')
  @ApiOperation({ summary: 'Get all car makes' })
  @ApiResponse({ status: 200, type: [String] })
  getMakes() {
    return this.listingsService.getMakes();
  }

  @Get('models')
  @ApiOperation({ summary: 'Get models for a specific make' })
  @ApiQuery({ name: 'make', required: true })
  @ApiResponse({ status: 200, type: [String] })
  @ApiResponse({ status: 400, type: ApiErrorResponse })
  getModels(@Query('make') make: string) {
    return this.listingsService.getModels(make);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured listings' })
  @ApiResponse({ status: 200, type: [ListingResponseDto] })
  getFeatured() {
    return this.listingsService.getFeatured();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get listing statistics' })
  @ApiResponse({ status: 200, type: ListingStatsDto })
  getStats() {
    return this.listingsService.getStats();
  }

  @Get('my/listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user listings' })
  @ApiResponse({ status: 200, type: [ListingResponseDto] })
  @ApiResponse({ status: 401, type: ApiErrorResponse })
  findMyListings(@Request() req: any) {
    return this.listingsService.findBySeller(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single listing by ID' })
  @ApiResponse({ status: 200, type: ListingResponseDto })
  @ApiResponse({ status: 404, type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new listing' })
  @ApiResponse({ status: 201, type: ListingResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponse })
  create(@Body() createListingDto: any, @Request() req: any) {
    return this.listingsService.create(req.user.userId, createListingDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing' })
  @ApiResponse({ status: 200, type: ListingResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponse })
  @ApiResponse({ status: 404, type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateListingDto: any, @Request() req: any) {
    return this.listingsService.update(id, req.user.userId, updateListingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete listing' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401, type: ApiErrorResponse })
  @ApiResponse({ status: 404, type: ApiErrorResponse })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.listingsService.remove(id, req.user.userId);
  }

  @Post(':id/feature')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Feature a listing (Admin only)' })
  @ApiResponse({ status: 200, type: ListingResponseDto })
  @ApiResponse({ status: 401, type: ApiErrorResponse })
  @ApiResponse({ status: 403, type: ApiErrorResponse })
  @ApiResponse({ status: 404, type: ApiErrorResponse })
  featureListing(@Param('id') id: string) {
    return this.listingsService.featureListing(id);
  }
}
