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
import { MechanicsService } from './mechanics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiErrorResponse } from '../common/dto/api-response.dto';
import { MechanicResponseDto } from '../common/dto/marketplace-response.dto';

@ApiTags('Mechanics')
@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all mechanics with filters' })
  @ApiResponse({ status: 200, description: 'Mechanics retrieved successfully', type: [MechanicResponseDto] })
  findAll(@Query() query: any) {
    return this.mechanicsService.findAll(query);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find mechanics near location' })
  @ApiResponse({ status: 200, description: 'Nearby mechanics retrieved successfully', type: [MechanicResponseDto] })
  @ApiResponse({ status: 400, description: 'Invalid location coordinates', type: ApiErrorResponse })
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('maxDistance') maxDistance?: string,
  ) {
    return this.mechanicsService.findNearby(
      Number(lat),
      Number(lng),
      maxDistance ? Number(maxDistance) : 10000,
    );
  }

  @Get('specializations')
  @ApiOperation({ summary: 'Get mechanic specializations' })
  @ApiResponse({ status: 200, description: 'Mechanic specializations retrieved successfully' })
  getSpecializations() {
    return this.mechanicsService.getSpecializations();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get cities with mechanics' })
  @ApiResponse({ status: 200, description: 'Cities with mechanics retrieved successfully' })
  getCities() {
    return this.mechanicsService.getCities();
  }

  @Get('my/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my mechanic profile' })
  @ApiResponse({ status: 200, description: 'Mechanic profile retrieved successfully', type: MechanicResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Mechanic or admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Mechanic profile not found', type: ApiErrorResponse })
  findMyProfile(@Request() req: any) {
    return this.mechanicsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mechanic by ID' })
  @ApiResponse({ status: 200, description: 'Mechanic retrieved successfully', type: MechanicResponseDto })
  @ApiResponse({ status: 404, description: 'Mechanic not found', type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.mechanicsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create mechanic profile' })
  @ApiResponse({ status: 201, description: 'Mechanic profile created successfully', type: MechanicResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Mechanic or admin access required', type: ApiErrorResponse })
  create(@Body() createMechanicDto: any, @Request() req: any) {
    return this.mechanicsService.create(req.user.userId, createMechanicDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update mechanic profile' })
  @ApiResponse({ status: 200, description: 'Mechanic profile updated successfully', type: MechanicResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Mechanic or admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Mechanic profile not found', type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateMechanicDto: any) {
    return this.mechanicsService.update(id, updateMechanicDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete mechanic profile' })
  @ApiResponse({ status: 200, description: 'Mechanic profile deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Mechanic or admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Mechanic profile not found', type: ApiErrorResponse })
  remove(@Param('id') id: string) {
    return this.mechanicsService.remove(id);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify mechanic (Admin only)' })
  @ApiResponse({ status: 200, description: 'Mechanic verified successfully', type: MechanicResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'Mechanic profile not found', type: ApiErrorResponse })
  verify(@Param('id') id: string) {
    return this.mechanicsService.update(id, { status: 'active' });
  }
}
