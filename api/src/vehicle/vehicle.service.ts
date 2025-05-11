import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleStatus } from 'src/constants/vehicle.constant';
import { VehicleTypeEnum } from 'src/constants/vehicleType.constant';
import { User } from '../user/user.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: createVehicleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createVehicleDto.userId} not found`,
      );
    }

    // Check if license plate already exists
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { licensePlate: createVehicleDto.licensePlate },
    });

    if (existingVehicle) {
      throw new BadRequestException('License plate already exists');
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: ['user'],
    });
  }

  async findActive(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { status: VehicleStatus.Active },
      relations: ['user'],
    });
  }

  async findInactive(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { status: VehicleStatus.Inactive },
      relations: ['user'],
    });
  }

  async findByVehicleType(vehicleType: VehicleTypeEnum): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { vehicleType },
      relations: ['user'],
    });
  }

  async findActiveByVehicleType(vehicleType: VehicleTypeEnum): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { 
        vehicleType,
        status: VehicleStatus.Active 
      },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with license plate ${licensePlate} not found`,
      );
    }

    return vehicle;
  }

  async findByUserId(userId: number): Promise<Vehicle[]> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.vehicleRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // If userId is being updated, check if the new user exists
    if (updateVehicleDto.userId && updateVehicleDto.userId !== vehicle.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateVehicleDto.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateVehicleDto.userId} not found`,
        );
      }
    }

    // If license plate is being updated, check if it already exists
    if (
      updateVehicleDto.licensePlate &&
      updateVehicleDto.licensePlate !== vehicle.licensePlate
    ) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { licensePlate: updateVehicleDto.licensePlate },
      });

      if (existingVehicle) {
        throw new BadRequestException('License plate already exists');
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async updateStatus(id: number, status: VehicleStatus): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    vehicle.status = status;
    return this.vehicleRepository.save(vehicle);
  }

  async activate(id: number): Promise<Vehicle> {
    return this.updateStatus(id, VehicleStatus.Active);
  }

  async deactivate(id: number): Promise<Vehicle> {
    return this.updateStatus(id, VehicleStatus.Inactive);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }
}
