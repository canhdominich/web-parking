import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Vehicle } from './vehicle.entity';
import { VehicleStatus } from 'src/constants/vehicle.constant';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

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
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all vehicles.',
    type: [Vehicle],
  })
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all active vehicles.',
    type: [Vehicle],
  })
  findActive() {
    return this.vehicleService.findActive();
  }

  @Get('inactive')
  @ApiOperation({ summary: 'Get all inactive vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Return all inactive vehicles.',
    type: [Vehicle],
  })
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
  findByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum) {
    return this.vehicleService.findByVehicleType(vehicleType);
  }

  @Get('type/:vehicleType/active')
  @ApiOperation({ summary: 'Get active vehicles by type' })
  @ApiResponse({
    status: 200,
    description: 'Return active vehicles of the specified type.',
    type: [Vehicle],
  })
  findActiveByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum) {
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
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.vehicleService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Get('license-plate/:licensePlate')
  @ApiOperation({ summary: 'Get a vehicle by license plate' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  findByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.vehicleService.findByLicensePlate(licensePlate);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vehicle status' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle status successfully updated.',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
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
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.remove(id);
  }
}
