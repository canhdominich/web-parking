import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';
import { VehicleStatus } from 'src/constants/vehicle.constant';

export class CreateVehicleDto {
  @ApiProperty({ example: '51F-12345' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ enum: VehicleTypeEnum, example: VehicleTypeEnum.Car })
  @IsEnum(VehicleTypeEnum)
  @IsNotEmpty()
  vehicleType: VehicleTypeEnum;

  @ApiProperty({ example: 'Toyota Camry' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 'Black' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ enum: VehicleStatus, example: VehicleStatus.Active })
  @IsEnum(VehicleStatus)
  @IsNotEmpty()
  status: VehicleStatus;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
