import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentFilterDto } from './dto/payment-filter.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
