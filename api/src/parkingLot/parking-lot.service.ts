import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingLot } from './parking-lot.entity';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { BookingStatus } from 'src/constants/booking.constant';
import { Booking } from 'src/booking/booking.entity';

@Injectable()
export class ParkingLotService {
  constructor(
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createParkingLotDto: CreateParkingLotDto): Promise<ParkingLot> {
    const parkingLot = this.parkingLotRepository.create(createParkingLotDto);
    return this.parkingLotRepository.save(parkingLot);
  }

  async findAll(): Promise<ParkingLot[]> {
    const parkingLots = await this.parkingLotRepository.find();

    // Get booking counts for each parking lot
    const parkingLotsWithBookingCount = await Promise.all(
      parkingLots.map(async (lot) => {
        const bookingCount = await this.bookingRepository.count({
          where: {
            parkingLotId: lot.id,
            status: BookingStatus.CheckedIn,
          },
        });

        return {
          ...lot,
          checkedInCount: bookingCount || 0,
          totalEmptySlots: (lot.totalSlots || 0) - (bookingCount || 0),
        };
      }),
    );

    return parkingLotsWithBookingCount;
  }

  async findOne(id: number): Promise<ParkingLot> {
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id },
    });

    if (!parkingLot) {
      throw new NotFoundException(`Parking lot with ID ${id} not found`);
    }

    return parkingLot;
  }

  async update(
    id: number,
    updateParkingLotDto: UpdateParkingLotDto,
  ): Promise<ParkingLot> {
    const parkingLot = await this.findOne(id);
    Object.assign(parkingLot, updateParkingLotDto);
    return this.parkingLotRepository.save(parkingLot);
  }

  async remove(id: number): Promise<void> {
    const parkingLot = await this.findOne(id);
    await this.parkingLotRepository.remove(parkingLot);
  }
}
