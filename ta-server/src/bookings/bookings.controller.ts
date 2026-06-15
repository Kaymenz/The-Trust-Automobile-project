import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my bookings', description: 'Get all bookings for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  getMyBookings(@Request() req: any) {
    return this.bookingsService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking details' })
  getBooking(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking (test drive, purchase, or rental)' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: any,
  ) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status' })
  updateBookingStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.bookingsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  cancelBooking(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancelBooking(id, req.user.userId);
  }
}
