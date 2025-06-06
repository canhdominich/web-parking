import { VehicleStatus } from 'src/constants/vehicle.constant';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';
import { User } from 'src/user/user.entity';
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

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  licensePlate: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'varchar', length: 255 })
  color: string;

  @Index('IDX_vehicle_type')
  @Column({ type: 'enum', enum: VehicleTypeEnum })
  vehicleType: VehicleTypeEnum;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.Active })
  status: VehicleStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
