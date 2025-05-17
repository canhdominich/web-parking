import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ParkingSlotService } from './parking-slot.service';
import { CreateParkingSlotDto } from './dto/create-parking-slot.dto';
import { UpdateParkingSlotDto } from './dto/update-parking-slot.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParkingSlot } from './parking-slot.entity';
import { VehicleTypeEnum } from '../constants/vehicleType.constant';

@ApiTags('parking-slots')
@Controller('parking-slots')
export class ParkingSlotController {
  constructor(private readonly parkingSlotService: ParkingSlotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new parking slot' })
  @ApiResponse({
    status: 201,
    description: 'Parking slot successfully created.',
    type: ParkingSlot,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or maximum capacity reached.',
  })
  @ApiResponse({
    status: 404,
    description: 'Parking lot not found.',
  })
  create(@Body() createParkingSlotDto: CreateParkingSlotDto) {
    return this.parkingSlotService.create(createParkingSlotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parking slots' })
  @ApiResponse({
    status: 200,
    description: 'Return all parking slots.',
    type: [ParkingSlot],
  })
  findAll() {
    return this.parkingSlotService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parking slot by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the parking slot.',
    type: ParkingSlot,
  })
  @ApiResponse({ status: 404, description: 'Parking slot not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkingSlotService.findOne(id);
  }

  @Get('parking-lot/:parkingLotId')
  @ApiOperation({ summary: 'Get all parking slots in a parking lot' })
  @ApiResponse({
    status: 200,
    description: 'Return all parking slots in the specified parking lot.',
    type: [ParkingSlot],
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  findByParkingLot(@Param('parkingLotId', ParseIntPipe) parkingLotId: number) {
    return this.parkingSlotService.findByParkingLot(parkingLotId);
  }

  @Get('vehicle-type/:vehicleType')
  @ApiOperation({ summary: 'Get all parking slots for a vehicle type' })
  @ApiResponse({
    status: 200,
    description: 'Return all parking slots for the specified vehicle type.',
    type: [ParkingSlot],
  })
  findByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum) {
    return this.parkingSlotService.findByVehicleType(vehicleType);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a parking slot' })
  @ApiResponse({
    status: 200,
    description: 'Parking slot successfully updated.',
    type: ParkingSlot,
  })
  @ApiResponse({ status: 404, description: 'Parking slot not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkingSlotDto: UpdateParkingSlotDto,
  ) {
    return this.parkingSlotService.update(id, updateParkingSlotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parking slot' })
  @ApiResponse({
    status: 200,
    description: 'Parking slot successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Parking slot not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkingSlotService.remove(id);
  }
}