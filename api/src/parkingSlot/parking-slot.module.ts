import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlot } from './parking-slot.entity';
import { ParkingLot } from '../parkingLots/parking-lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot, ParkingLot])],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
  exports: [ParkingSlotService],
})
export class ParkingSlotModule {} 