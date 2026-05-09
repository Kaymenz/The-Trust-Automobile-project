import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: require('../users/schemas/user.schema').UserSchema },
      { name: 'Listing', schema: require('../listings/schemas/listing.schema').ListingSchema },
      { name: 'Booking', schema: require('../bookings/schemas/booking.schema').BookingSchema },
      { name: 'PartsOrder', schema: require('../parts-orders/schemas/parts-order.schema').PartsOrderSchema },
      { name: 'Mechanic', schema: require('../mechanics/schemas/mechanic.schema').MechanicSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
