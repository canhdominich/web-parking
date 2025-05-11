import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentFilterDto } from './dto/payment-filter.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get payment history for a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment history for the specified user',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPaymentHistory(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() filterDto: PaymentFilterDto,
  ) {
    return this.paymentService.findUserPaymentHistory(userId, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific payment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment details',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payments for a specific booking' })
  @ApiResponse({
    status: 200,
    description: 'Returns all payments associated with the booking',
  })
  async getBookingPayments(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ) {
    return this.paymentService.findByBooking(bookingId);
  }
}
