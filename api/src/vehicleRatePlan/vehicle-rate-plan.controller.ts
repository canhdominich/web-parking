import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VehicleRatePlanService } from './vehicle-rate-plan.service';
import { CreateVehicleRatePlanDto } from './dto/create-vehicle-rate-plan.dto';
import { UpdateVehicleRatePlanDto } from './dto/update-vehicle-rate-plan.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VehicleRatePlan } from './vehicleRatePlan.entity';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

@ApiTags('vehicle-rate-plans')
@Controller('vehicle-rate-plans')
export class VehicleRatePlanController {
  constructor(
    private readonly vehicleRatePlanService: VehicleRatePlanService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle rate plan' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle rate plan successfully created.',
    type: VehicleRatePlan,
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input or rate plan already exists for this vehicle type.',
  })
  create(@Body() createVehicleRatePlanDto: CreateVehicleRatePlanDto) {
    return this.vehicleRatePlanService.create(createVehicleRatePlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicle rate plans' })
  @ApiResponse({
    status: 200,
    description: 'Return all vehicle rate plans.',
    type: [VehicleRatePlan],
  })
  findAll() {
    return this.vehicleRatePlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle rate plan by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle rate plan.',
    type: VehicleRatePlan,
  })
  @ApiResponse({ status: 404, description: 'Vehicle rate plan not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleRatePlanService.findOne(id);
  }

  @Get('type/:vehicleType')
  @ApiOperation({ summary: 'Get a vehicle rate plan by vehicle type' })
  @ApiResponse({
    status: 200,
    description: 'Return the vehicle rate plan.',
    type: VehicleRatePlan,
  })
  @ApiResponse({ status: 404, description: 'Vehicle rate plan not found.' })
  findByVehicleType(@Param('vehicleType') vehicleType: VehicleTypeEnum) {
    return this.vehicleRatePlanService.findByVehicleType(vehicleType);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle rate plan' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle rate plan successfully updated.',
    type: VehicleRatePlan,
  })
  @ApiResponse({ status: 404, description: 'Vehicle rate plan not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleRatePlanDto: UpdateVehicleRatePlanDto,
  ) {
    return this.vehicleRatePlanService.update(id, updateVehicleRatePlanDto);
  }

  @Patch('type/:vehicleType')
  @ApiOperation({ summary: 'Update a vehicle rate plan by vehicle type' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle rate plan successfully updated.',
    type: VehicleRatePlan,
  })
  @ApiResponse({ status: 404, description: 'Vehicle rate plan not found.' })
  updateByVehicleType(
    @Param('vehicleType') vehicleType: VehicleTypeEnum,
    @Body() updateVehicleRatePlanDto: UpdateVehicleRatePlanDto,
  ) {
    return this.vehicleRatePlanService.updateByVehicleType(
      vehicleType,
      updateVehicleRatePlanDto,
    );
  }
}
