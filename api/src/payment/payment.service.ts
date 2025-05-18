import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentFilterDto } from './dto/payment-filter.dto';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import dateFormat from 'dateformat';
import { Booking } from 'src/booking/booking.entity';
import { BookingPaymentStatus } from 'src/constants/booking.constant';
import { TransactionStatus } from 'src/constants/payment.constant';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {}

  async findUserPaymentHistory(
    userId: number,
    filterDto: PaymentFilterDto,
  ): Promise<Payment[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Build where conditions
    const whereConditions: Record<string, any> = {
      userId,
    };

    // Add status filter if provided
    if (filterDto.status) {
      whereConditions.status = filterDto.status;
    }

    // Add payment method filter if provided
    if (filterDto.method) {
      whereConditions.method = filterDto.method;
    }

    // Add date range filter if provided
    if (filterDto.startDate && filterDto.endDate) {
      whereConditions.createdAt = Between(
        new Date(filterDto.startDate),
        new Date(filterDto.endDate),
      );
    }

    // Get payments with relations
    return this.paymentRepository.find({
      where: whereConditions,
      relations: ['user', 'booking'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'booking'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async findByBooking(bookingId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { bookingId },
      relations: ['user', 'booking'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  createVNPayPaymentUrl(bookingId: number, amount: number) {
    try {
      const vnp_TmnCode = this.configService.get<string>('VNP_TMNCODE')!;
      const vnp_HashSecret = this.configService.get<string>('VNP_HASHSECRET')!;
      const vnp_Url = this.configService.get<string>('VNP_URL')!;
      const vnp_Returnurl = `${this.configService.get<string>('HOST')}:${this.configService.get<string>('PORT')}${this.configService.get<string>('VNP_RETURNURL')}`;
      const vnp_Locale = this.configService.get<string>('VNP_LOCALE') || 'vn';
      const vnp_BankCode = this.configService.get<string>('VNP_BANKCODE') || '';

      const currentDate = new Date();
      const vnp_TxnRef = bookingId.toString();

      const inputData: Record<string, string | number> = {
        vnp_Version: '2.1.0',
        vnp_TmnCode,
        vnp_Amount: amount.toString(),
        vnp_Command: 'pay',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        vnp_CreateDate: dateFormat(currentDate, 'yyyymmddHHMMss'),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: '127.0.0.1',
        vnp_Locale,
        vnp_OrderInfo: `Thanh toan:${vnp_TxnRef}`,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: vnp_Returnurl,
        vnp_TxnRef,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        vnp_ExpireDate: dateFormat(
          new Date(currentDate.getTime() + 15 * 60 * 1000),
          'yyyymmddHHMMss',
        ),
      };

      if (vnp_BankCode) {
        inputData['vnp_BankCode'] = vnp_BankCode;
      }

      // Sort params by key
      const sortedParams = Object.fromEntries(
        Object.entries(inputData).sort(([a], [b]) => a.localeCompare(b)),
      );

      // Create query string
      const querystring = new URLSearchParams(
        Object.entries(sortedParams).map(([key, value]) => [
          key,
          value.toString(),
        ]),
      ).toString();

      // Create secure hash
      const vnp_SecureHash = crypto
        .createHmac('sha512', vnp_HashSecret)
        .update(querystring)
        .digest('hex');

      // Return final URL
      console.log('inputData = ', inputData);
      return `${vnp_Url}?${querystring}&vnp_SecureHash=${vnp_SecureHash}`;
    } catch (error) {
      throw new Error(`Failed to create VNPay payment URL: ${error}`);
    }
  }

  async handleVNPayWebhook(query: Record<string, string>) {
    try {
      const vnp_SecureHash = query['vnp_SecureHash'];
      const vnp_HashSecret = this.configService.get<string>('VNP_HASHSECRET')!;

      const inputData: Record<string, string> = {};
      Object.entries(query).forEach(([key, value]) => {
        if (key.startsWith('vnp_') && key !== 'vnp_SecureHash') {
          inputData[key] = value;
        }
      });

      const sortedParams = Object.fromEntries(
        Object.entries(inputData).sort(([a], [b]) => a.localeCompare(b)),
      );

      // Create querystring string (NO encode!)
      const querystring = new URLSearchParams(
        Object.entries(sortedParams).map(([key, value]) => [
          key,
          value.toString(),
        ]),
      ).toString();

      // Hash
      const signed = crypto
        .createHmac('sha512', vnp_HashSecret)
        .update(Buffer.from(querystring, 'utf-8'))
        .digest('hex');

      // Verify hash
      if (signed === vnp_SecureHash) {
        const bookingId = parseInt(query['vnp_TxnRef']);
        const booking = await this.bookingRepository.findOne({
          where: { id: bookingId },
        });

        if (!booking) {
          throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        // Update payment status
        const paymentStatus =
          query['vnp_ResponseCode'] === '00'
            ? BookingPaymentStatus.Paid
            : BookingPaymentStatus.Unpaid;

        await this.paymentRepository.upsert(
          {
            bookingId,
            amount: booking.totalPrice,
            paidAt: new Date(),
            transactionId: query['vnp_TransactionNo'],
            status:
              paymentStatus === BookingPaymentStatus.Paid
                ? TransactionStatus.Success
                : TransactionStatus.Failed,
            note: `${query['vnp_OrderInfo'] ?? ''} - ${
              query['vnp_BankCode'] ?? ''
            } - ${query['vnp_CardType'] ?? ''}`,
          },
          ['bookingId'],
        );

        return {
          success: true,
          message:
            paymentStatus === BookingPaymentStatus.Paid
              ? 'Giao dịch thành công'
              : 'Giao dịch không thành công',
          redirectUrl: `/booking`,
        };
      }

      return {
        success: false,
        message: 'Invalid secure hash',
        redirectUrl: '/booking',
      };
    } catch (error) {
      console.error('VNPay webhook error:', error);
      return {
        success: false,
        message: 'Internal server error',
        redirectUrl: '/booking',
      };
    }
  }
}
