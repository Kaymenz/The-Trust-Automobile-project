import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { FleetModule } from './fleet/fleet.module';
import { SparePartsModule } from './spare-parts/spare-parts.module';
import { MechanicsModule } from './mechanics/mechanics.module';
import { BookingsModule } from './bookings/bookings.module';
import { SellerModule } from './seller/seller.module';
import { PartsOrdersModule } from './parts-orders/parts-orders.module';
import { MessagesModule } from './messages/messages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/trust_automobile'),
    AuthModule,
    UsersModule,
    ListingsModule,
    FleetModule,
    SparePartsModule,
    MechanicsModule,
    BookingsModule,
    SellerModule,
    PartsOrdersModule,
    MessagesModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
