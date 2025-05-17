import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Booking } from './booking.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/constants/user.constant';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully created.',
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or parking slot not available.',
  })
  @ApiResponse({
    status: 404,
    description: 'User, vehicle, parking lot, or parking slot not found.',
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({
    status: 200,
    description: 'Return all bookings.',
    type: [Booking],
  })
  findAll(@Request() req) {
    if (
      req.user.role === UserRole.Admin ||
      req.user.role === UserRole.ParkingStaff
    ) {
      return this.bookingService.findAll();
    }
    return this.bookingService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the booking.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all bookings for the specified user.',
    type: [Booking],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookingService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully updated.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.remove(id);
  }

  @Get('dashboard-statistics')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Return dashboard statistics.' })
  getDashboardStats() {
    return this.bookingService.getDashboardStats();
  }
}
