import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from 'src/constants/booking.constant';
import { PaymentStatus } from 'src/constants/payment.constant';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  parkingLotId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  slotId: number;

  @ApiProperty({ example: '2024-03-20T10:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  checkinTime: Date;

  @ApiProperty({ example: BookingStatus.Pending })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;

  @ApiProperty({ example: PaymentStatus.Unpaid })
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  paymentStatus: PaymentStatus;
}