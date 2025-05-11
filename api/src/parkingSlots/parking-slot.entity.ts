import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ParkingLot } from '../parkingLots/parking-lot.entity';
import { ParkingSlotStatus } from '../constants/parkingSlot.constant';
import { VehicleTypeEnum } from '../constants/vehicleType.constant';

@Entity('parking_slots')
export class ParkingSlot {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint' })
  parkingLotId: number;

  @ManyToOne(() => ParkingLot)
  @JoinColumn({ name: 'parkingLotId' })
  parkingLot: ParkingLot;

  @Index('IDX_vehicle_type')
  @Column({
    type: 'enum',
    enum: VehicleTypeEnum,
  })
  vehicleType: VehicleTypeEnum;

  @Column({ type: 'enum', enum: ParkingSlotStatus })
  status: ParkingSlotStatus;

  @Column({ type: 'datetime' })
  lastUpdated: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
