import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { VehicleTypeEnum } from '../../constants/vehicleType.constant';
import { ParkingSlotStatus } from '../../constants/parkingSlot.constant';

export class CreateParkingSlotDto {
  @ApiProperty({ example: 'A-001' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  parkingLotId: number;

  @ApiProperty({ enum: VehicleTypeEnum, example: VehicleTypeEnum.Car })
  @IsEnum(VehicleTypeEnum)
  @IsNotEmpty()
  vehicleType: VehicleTypeEnum;

  @ApiProperty({ enum: ParkingSlotStatus, example: ParkingSlotStatus.Available })
  @IsEnum(ParkingSlotStatus)
  @IsNotEmpty()
  status: ParkingSlotStatus;
} 