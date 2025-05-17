import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { ParkingLot } from '../parkingLot/parking-lot.entity';
import { ParkingSlot } from '../parkingSlot/parking-slot.entity';
import { BookingStatus } from '../constants/booking.constant';
import { ParkingSlotStatus } from '../constants/parkingSlot.constant';
import { PaymentStatus } from '../constants/payment.constant';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(ParkingLot)
    private readonly parkingLotRepository: Repository<ParkingLot>,
    @InjectRepository(ParkingSlot)
    private readonly parkingSlotRepository: Repository<ParkingSlot>,
  ) { }

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: createBookingDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createBookingDto.userId} not found`,
      );
    }

    // Check if vehicle exists
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createBookingDto.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with ID ${createBookingDto.vehicleId} not found`,
      );
    }

    // Check if parking lot exists
    const parkingLot = await this.parkingLotRepository.findOne({
      where: { id: createBookingDto.parkingLotId },
    });
    if (!parkingLot) {
      throw new NotFoundException(
        `Parking lot with ID ${createBookingDto.parkingLotId} not found`,
      );
    }

    // Check if parking slot exists and is available
    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: { id: createBookingDto.slotId },
    });
    if (!parkingSlot) {
      throw new NotFoundException(
        `Parking slot with ID ${createBookingDto.slotId} not found`,
      );
    }

    const findBooking = await this.bookingRepository.findOne({
      where: {
        slotId: createBookingDto.slotId,
        status: In([
          BookingStatus.CheckedIn,
          BookingStatus.Booked,
          BookingStatus.Pending,
        ]),
        paymentStatus: PaymentStatus.Paid,
      },
    });
    if (findBooking) {
      throw new BadRequestException(
        `Parking slot with ID ${createBookingDto.slotId} is already booked`,
      );
    }

    // Create booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      status: createBookingDto.status || BookingStatus.Pending,
      paymentStatus: createBookingDto.paymentStatus || PaymentStatus.Unpaid,
      totalPrice: 0,
    });

    // Update parking slot status
    parkingSlot.status = ParkingSlotStatus.Occupied;
    await this.parkingSlotRepository.save(parkingSlot);

    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'vehicle', 'parkingLot', 'slot'],
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle', 'parkingLot', 'slot'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: number): Promise<Booking[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.bookingRepository.find({
      where: { userId },
      relations: ['user', 'vehicle', 'parkingLot', 'slot'],
    });
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    // If status is being updated to CheckedOut
    if (
      updateBookingDto.status === BookingStatus.CheckedOut &&
      booking.status !== BookingStatus.CheckedOut
    ) {
      // Update parking slot status back to Available
      const parkingSlot = await this.parkingSlotRepository.findOne({
        where: { id: booking.slotId },
      });
      const findBookingWithSlotFromNow = await this.bookingRepository.findOne({
        where: {
          id: Not(id),
          slotId: booking.slotId,
          status: In([
            BookingStatus.CheckedIn,
            BookingStatus.Booked,
            BookingStatus.Pending,
          ]),
          paymentStatus: PaymentStatus.Paid,
          checkinTime: LessThanOrEqual(new Date()),
        },
      });

      if (parkingSlot && !findBookingWithSlotFromNow) {
        parkingSlot.status = ParkingSlotStatus.Available;
        await this.parkingSlotRepository.save(parkingSlot);
      }

      // Set checkout time if not provided
      if (!updateBookingDto.checkoutTime) {
        updateBookingDto.checkoutTime = new Date();
      }
    }

    Object.assign(booking, updateBookingDto);
    return this.bookingRepository.save(booking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.findOne(id);

    if (
      [
        BookingStatus.CheckedIn,
        BookingStatus.Booked,
        BookingStatus.Pending,
        BookingStatus.CheckedOut,
      ].includes(booking.status) &&
      booking.paymentStatus === PaymentStatus.Paid
    ) {
      throw new BadRequestException('Booking is not allowed to be deleted');
    }

    const parkingSlot = await this.parkingSlotRepository.findOne({
      where: { id: booking.slotId },
    });

    const findBookingWithSlotFromNow = await this.bookingRepository.findOne({
      where: {
        id: Not(id),
        slotId: booking.slotId,
        status: In([
          BookingStatus.CheckedIn,
          BookingStatus.Booked,
          BookingStatus.Pending,
        ]),
        paymentStatus: PaymentStatus.Paid,
        checkinTime: LessThanOrEqual(new Date()),
      },
    });
    if (parkingSlot && !findBookingWithSlotFromNow) {
      parkingSlot.status = ParkingSlotStatus.Available;
      await this.parkingSlotRepository.save(parkingSlot);
    }

    await this.bookingRepository.remove(booking);
  }
}
