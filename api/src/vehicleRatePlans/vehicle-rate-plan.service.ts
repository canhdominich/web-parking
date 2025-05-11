import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleRatePlan } from './vehicleRatePlan.entity';
import { CreateVehicleRatePlanDto } from './dto/create-vehicle-rate-plan.dto';
import { UpdateVehicleRatePlanDto } from './dto/update-vehicle-rate-plan.dto';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';

@Injectable()
export class VehicleRatePlanService {
  constructor(
    @InjectRepository(VehicleRatePlan)
    private readonly vehicleRatePlanRepository: Repository<VehicleRatePlan>,
  ) {}

  async create(
    createVehicleRatePlanDto: CreateVehicleRatePlanDto,
  ): Promise<VehicleRatePlan> {
    // Check if rate plan already exists for this vehicle type
    const existingRatePlan = await this.vehicleRatePlanRepository.findOne({
      where: { vehicleType: createVehicleRatePlanDto.vehicleType },
    });

    if (existingRatePlan) {
      throw new BadRequestException(
        `Rate plan already exists for vehicle type ${createVehicleRatePlanDto.vehicleType}`,
      );
    }

    const ratePlan = this.vehicleRatePlanRepository.create(
      createVehicleRatePlanDto,
    );
    return this.vehicleRatePlanRepository.save(ratePlan);
  }

  async findAll(): Promise<VehicleRatePlan[]> {
    return this.vehicleRatePlanRepository.find();
  }

  async findOne(id: number): Promise<VehicleRatePlan> {
    const ratePlan = await this.vehicleRatePlanRepository.findOne({
      where: { id },
    });

    if (!ratePlan) {
      throw new NotFoundException(`Rate plan with ID ${id} not found`);
    }

    return ratePlan;
  }

  async findByVehicleType(
    vehicleType: VehicleTypeEnum,
  ): Promise<VehicleRatePlan> {
    const ratePlan = await this.vehicleRatePlanRepository.findOne({
      where: { vehicleType },
    });

    if (!ratePlan) {
      throw new NotFoundException(
        `Rate plan for vehicle type ${vehicleType} not found`,
      );
    }

    return ratePlan;
  }

  async update(
    id: number,
    updateVehicleRatePlanDto: UpdateVehicleRatePlanDto,
  ): Promise<VehicleRatePlan> {
    const ratePlan = await this.findOne(id);
    Object.assign(ratePlan, updateVehicleRatePlanDto);
    return this.vehicleRatePlanRepository.save(ratePlan);
  }

  async updateByVehicleType(
    vehicleType: VehicleTypeEnum,
    updateVehicleRatePlanDto: UpdateVehicleRatePlanDto,
  ): Promise<VehicleRatePlan> {
    const ratePlan = await this.findByVehicleType(vehicleType);
    Object.assign(ratePlan, updateVehicleRatePlanDto);
    return this.vehicleRatePlanRepository.save(ratePlan);
  }
}
