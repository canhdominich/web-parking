import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, Matches } from 'class-validator';

export class UpdateParkingLotDto {
  @ApiProperty({ example: 'Parking Lot A', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '123 Main Street, District 1, HCMC',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '08:00:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'openTime must be in format HH:mm:ss',
  })
  openTime?: string;

  @ApiProperty({ example: '22:00:00', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'closeTime must be in format HH:mm:ss',
  })
  closeTime?: string;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalSlots?: number;
}
