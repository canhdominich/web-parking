import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

@Entity('vehicle_rate_plans')
export class VehicleRatePlan {
  @ApiProperty({ description: 'The unique identifier of the rate plan' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The type of vehicle this rate plan applies to',
    enum: VehicleTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: VehicleTypeEnum,
    unique: true,
  })
  vehicleType: VehicleTypeEnum;

  @ApiProperty({ description: 'The price per entry for this vehicle type' })
  @Column('decimal', { precision: 10, scale: 2 })
  pricePerEntry: number;

  @ApiProperty({ description: 'When the rate plan was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'When the rate plan was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}
