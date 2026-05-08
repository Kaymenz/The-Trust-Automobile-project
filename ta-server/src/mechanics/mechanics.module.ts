import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MechanicsService } from './mechanics.service';
import { MechanicsController } from './mechanics.controller';
import { Mechanic, MechanicSchema } from './schemas/mechanic.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Mechanic.name, schema: MechanicSchema }])],
  controllers: [MechanicsController],
  providers: [MechanicsService],
  exports: [MechanicsService],
})
export class MechanicsModule {}
