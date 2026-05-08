import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetService } from './fleet.service';
import { FleetController } from './fleet.controller';
import { FleetCar, FleetCarSchema } from './schemas/fleet-car.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FleetCar.name, schema: FleetCarSchema }])],
  controllers: [FleetController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
