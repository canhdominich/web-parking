import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ParkingSlot } from './parking-slot.entity';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { ParkingLot } from '../parkingLot/parking-lot.entity';
import { VehicleTypeEnum } from '../constants/vehicleType.constant';
import { BookingStatus } from 'src/constants/booking.constant';
import { Booking } from 'src/booking/booking.entity';

@Injectable()
export class ParkingSlotService {
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(
    createParkingSlotDto: CreateParkingSlotDto,
  ): Promise<ParkingSlot> {
    // Check if parking lot exists
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: createParkingSlotDto.parkingLotId },
    });

    if (!parkingLot) {
      throw new NotFoundException(
        `Parking lot with ID ${createParkingSlotDto.parkingLotId} not found`,
      );
    }

    // Count existing slots in the parking lot
    const slotCount = await this.parkingSlotRepository.count({
      where: { parkingLotId: createParkingSlotDto.parkingLotId },
    });

    // Check if adding new slot would exceed total slots
    if (slotCount > parkingLot.totalSlots) {
      throw new BadRequestException(
        `Cannot add more parking slots. Maximum capacity (${parkingLot.totalSlots}) reached`,
      );
    }

    const parkingSlot = this.parkingSlotRepository.create({
      ...createParkingSlotDto,
      lastUpdated: new Date(),
    });

    return this.parkingSlotRepository.save(parkingSlot);
  }

  async findAll(): Promise<ParkingSlot[]> {
    const slots = await this.parkingSlotRepository.find({
      relations: ['parkingLot'],
    });

    const slotsWithBooking = await Promise.all(
      slots.map(async (slot) => {
        const booking = await this.bookingRepository.findOne({
          relations: ['vehicle', 'user'],
          where: {
            parkingLotId: slot.parkingLotId,
            status: In([BookingStatus.CheckedIn, BookingStatus.Booked]),
          },
        });

        return {
          ...slot,
          booking: booking || {},
        };
      }),
    );

    return slotsWithBooking;
  }

  async findOne(id: number): Promise<ParkingSlot> {
    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: { id },
      relations: ['parkingLot'],
    });

    if (!parkingSlot) {
      throw new NotFoundException(`Parking slot with ID ${id} not found`);
    }

    return parkingSlot;
  }

  async findByParkingLot(parkingLotId: number): Promise<ParkingSlot[]> {
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: parkingLotId },
    });

    if (!parkingLot) {
      throw new NotFoundException(
        `Parking lot with ID ${parkingLotId} not found`,
      );
    }

    const slots = await this.parkingSlotRepository.find({
      where: { parkingLotId },
      relations: ['parkingLot'],
    });

    const slotsWithBooking = await Promise.all(
      slots.map(async (slot) => {
        const booking = await this.bookingRepository.findOne({
          relations: ['vehicle', 'user'],
          where: {
            parkingLotId: slot.parkingLotId,
            status: In([BookingStatus.CheckedIn, BookingStatus.Booked]),
          },
        });

        return {
          ...slot,
          booking: booking || {},
        };
      }),
    );

    return slotsWithBooking;
  }

  async findByVehicleType(
    vehicleType: VehicleTypeEnum,
  ): Promise<ParkingSlot[]> {
    return this.parkingSlotRepository.find({
      where: { vehicleType },
      relations: ['parkingLot'],
    });
  }

  async update(
    id: number,
    updateParkingSlotDto: UpdateParkingSlotDto,
  ): Promise<ParkingSlot> {
    const parkingSlot = await this.findOne(id);

    Object.assign(parkingSlot, {
      ...updateParkingSlotDto,
      lastUpdated: new Date(),
    });

    return this.parkingSlotRepository.save(parkingSlot);
  }

  async remove(id: number): Promise<void> {
    const parkingSlot = await this.findOne(id);
    await this.parkingSlotRepository.remove(parkingSlot);
  }
}
