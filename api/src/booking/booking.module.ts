import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { ParkingLot } from '../parkingLot/parking-lot.entity';
import { ParkingSlot } from '../parkingSlot/parking-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      User,
      Vehicle,
      ParkingLot,
      ParkingSlot,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {} 