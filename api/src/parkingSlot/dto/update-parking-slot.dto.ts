import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ParkingSlotStatus } from '../../constants/parkingSlot.constant';

export class UpdateParkingSlotDto {
  @ApiProperty({ example: 'A-001', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: ParkingSlotStatus, example: ParkingSlotStatus.Occupied, required: false })
  @IsEnum(ParkingSlotStatus)
  @IsOptional()
  status?: ParkingSlotStatus;
} 