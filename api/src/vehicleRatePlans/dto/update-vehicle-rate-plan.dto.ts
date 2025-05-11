import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateVehicleRatePlanDto {
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(0)
  pricePerEntry: number;
} 