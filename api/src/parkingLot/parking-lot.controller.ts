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
import { ParkingLotService } from './parking-lot.service';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParkingLot } from './parking-lot.entity';

@ApiTags('parking-lots')
@Controller('parking-lots')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new parking lot' })
  @ApiResponse({
    status: 201,
    description: 'Parking lot successfully created.',
    type: ParkingLot,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or available spaces greater than total spaces.',
  })
  create(@Body() createParkingLotDto: CreateParkingLotDto) {
    return this.parkingLotService.create(createParkingLotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parking lots' })
  @ApiResponse({
    status: 200,
    description: 'Return all parking lots.',
  })
  findAll() {
    return this.parkingLotService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parking lot by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the parking lot.',
    type: ParkingLot,
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkingLotService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a parking lot' })
  @ApiResponse({
    status: 200,
    description: 'Parking lot successfully updated.',
    type: ParkingLot,
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or available spaces greater than total spaces.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkingLotDto: UpdateParkingLotDto,
  ) {
    return this.parkingLotService.update(id, updateParkingLotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parking lot' })
  @ApiResponse({
    status: 200,
    description: 'Parking lot successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkingLotService.remove(id);
  }
}
