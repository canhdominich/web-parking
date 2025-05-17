import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../../constants/booking.constant';
import { PaymentStatus } from '../../constants/payment.constant';

export class UpdateBookingDto {
  @ApiProperty({ example: '2024-03-20T15:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  checkoutTime?: Date;

  @ApiProperty({ enum: BookingStatus, required: false })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({ example: 50.00, required: false })
  @IsOptional()
  totalPrice?: number;

  @ApiProperty({ enum: PaymentStatus, required: false })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
}