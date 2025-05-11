import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

export class CreateVehicleRatePlanDto {
  @ApiProperty({ enum: VehicleTypeEnum, example: VehicleTypeEnum.Car })
  @IsEnum(VehicleTypeEnum)
  @IsNotEmpty()
  vehicleType: VehicleTypeEnum;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  pricePerEntry: number;
} 