import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, Matches } from 'class-validator';

export class CreateParkingLotDto {
  @ApiProperty({ example: 'Parking Lot A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main Street, District 1, HCMC' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '08:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'openTime must be in format HH:mm:ss',
  })
  openTime: string;

  @ApiProperty({ example: '22:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'closeTime must be in format HH:mm:ss',
  })
  closeTime: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  totalSlots: number;
}
