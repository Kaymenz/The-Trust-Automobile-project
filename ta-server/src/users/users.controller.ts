import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserResponseDto, UserStatsDto, ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user', description: 'Create a new user account with the provided details.' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email already registered', type: ApiErrorResponse })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)', description: 'Retrieve a list of all registered users. Admin access only.' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics (Admin only)', description: 'Get user count statistics by status. Admin access only.' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved', type: UserStatsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  getStats() {
    return this.usersService.getStats();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile', description: 'Retrieve the authenticated user\'s own profile.' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Get('me/saved-cars')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get saved cars', description: 'Retrieve all saved/favourited car listings for the current user.' })
  @ApiResponse({ status: 200, description: 'Saved cars retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  getSavedCars(@CurrentUser() user: any) {
    return this.usersService.getSavedCars(user.userId);
  }

  @Post('me/saved-cars/:listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Save a car listing' })
  @ApiResponse({ status: 204, description: 'Car saved successfully' })
  async saveCar(@CurrentUser() user: any, @Param('listingId') listingId: string) {
    await this.usersService.saveCar(user.userId, listingId);
  }

  @Delete('me/saved-cars/:listingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a saved car listing' })
  @ApiResponse({ status: 204, description: 'Car removed from saved' })
  async unsaveCar(@CurrentUser() user: any, @Param('listingId') listingId: string) {
    await this.usersService.unsaveCar(user.userId, listingId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user\'s profile by their ID.' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'User not found', type: ApiErrorResponse })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user', description: 'Update user information. Users can only update their own profile unless they are admin.' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own profile', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'User not found', type: ApiErrorResponse })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)', description: 'Delete a user account. Admin access only.' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required', type: ApiErrorResponse })
  @ApiResponse({ status: 404, description: 'User not found', type: ApiErrorResponse })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
