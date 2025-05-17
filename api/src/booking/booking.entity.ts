import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { ParkingLot } from 'src/parkingLot/parking-lot.entity';
import { ParkingSlot } from 'src/parkingSlot/parking-slot.entity';
import { BookingStatus } from 'src/constants/booking.constant';
import { PaymentStatus } from 'src/constants/payment.constant';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'bigint' })
  vehicleId: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column({ type: 'bigint' })
  parkingLotId: number;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parkingLotId' })
  parkingLot: ParkingLot;

  @Column({ type: 'bigint' })
  slotId: number;

  @ManyToOne(() => ParkingSlot)
  @JoinColumn({ name: 'slotId' })
  slot: ParkingSlot;

  @Column({ type: 'datetime' })
  checkinTime: Date;

  @Column({ type: 'datetime', nullable: true })
  checkoutTime: Date | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
