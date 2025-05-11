import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

@Entity('vehicle_rate_plans')
export class VehicleRatePlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_vehicle_type')
  @Column({
    type: 'enum',
    enum: VehicleTypeEnum,
    unique: true,
  })
  vehicleType: VehicleTypeEnum;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerEntry: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
