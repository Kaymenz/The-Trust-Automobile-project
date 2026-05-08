import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartsOrdersService } from './parts-orders.service';
import { PartsOrdersController } from './parts-orders.controller';
import { PartsOrder, PartsOrderSchema } from './schemas/parts-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PartsOrder.name, schema: PartsOrderSchema },
    ]),
  ],
  controllers: [PartsOrdersController],
  providers: [PartsOrdersService],
  exports: [PartsOrdersService],
})
export class PartsOrdersModule {}
