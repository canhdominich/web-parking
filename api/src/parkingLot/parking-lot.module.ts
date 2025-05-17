import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLot } from './parking-lot.entity';
import { Booking } from '../booking/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot, Booking])],
  controllers: [ParkingLotController],
  providers: [ParkingLotService],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}
