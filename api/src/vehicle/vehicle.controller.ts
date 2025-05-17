import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Vehicle } from './vehicle.entity';
import { VehicleStatus } from 'src/constants/vehicle.constant';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../constants/user.constant';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle successfully created.',
    type: Vehicle,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or license plate already exists.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @Roles(UserRole.Admin, UserRole.ParkingGuest)
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    if (req.user.role !== UserRole.Admin) {
      createVehicleDto.userId = req.user.id;
    }
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all vehicles.',
    type: [Vehicle],
  })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findAll(@Request() req) {
    return this.vehicleService.findAll(req.user);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all active vehicles.',
    type: [Vehicle],
  })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findActive(@Request() req) {
    if (req.user.role !== UserRole.Admin) {
      return this.vehicleService.findActiveByUserId(req.user.id);
    }
    return this.vehicleService.findActive();
  }

  @Get('inactive')
  @ApiOperation({ summary: 'Get all inactive vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all inactive vehicles.',
    type: [Vehicle],
  })
  @Roles(UserRole.Admin)
  findInactive() {
    return this.vehicleService.findInactive();
  }

  @Get('type/:vehicleType')
  @ApiOperation({ summary: 'Get vehicles by type' })
  @ApiResponse({
    status: 200,
    description: 'Return vehicles of the specified type.',
    type: [Vehicle],
  })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum, @Request() req) {
    if (req.user.role !== UserRole.Admin) {
      return this.vehicleService.findByVehicleTypeAndUserId(vehicleType, req.user.id);
    }
    return this.vehicleService.findByVehicleType(vehicleType);
  }

  @Get('type/:vehicleType/active')
  @ApiOperation({ summary: 'Get active vehicles by type' })
  @ApiResponse({
    status: 200,
    description: 'Return active vehicles of the specified type.',
    type: [Vehicle],
  })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findActiveByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum, @Request() req) {
    if (req.user.role !== UserRole.Admin) {
      return this.vehicleService.findActiveByVehicleTypeAndUserId(vehicleType, req.user.id);
    }
    return this.vehicleService.findActiveByVehicleType(vehicleType);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all vehicles of a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all vehicles of the user.',
    type: [Vehicle],
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findByUserId(@Param('userId', ParseIntPipe) userId: number, @Request() req) {
    return this.vehicleService.findByUserId(userId, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehicleService.findOne(id, req.user);
  }

  @Get('license-plate/:licensePlate')
  @ApiOperation({ summary: 'Get a vehicle by license plate' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin, UserRole.ParkingStaff, UserRole.ParkingGuest)
  findByLicensePlate(@Param('licensePlate') licensePlate: string, @Request() req) {
    return this.vehicleService.findByLicensePlate(licensePlate, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully updated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or license plate already exists.',
  })
  @Roles(UserRole.Admin, UserRole.ParkingGuest)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req,
  ) {
    return this.vehicleService.update(id, updateVehicleDto, req.user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vehicle status' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle status successfully updated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: VehicleStatus,
  ) {
    return this.vehicleService.updateStatus(id, status);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully activated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin)
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.activate(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a vehicle' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle successfully deactivated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  @Roles(UserRole.Admin, UserRole.ParkingGuest)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.vehicleService.remove(id, req.user);
  }
}
