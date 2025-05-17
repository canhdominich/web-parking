import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleStatus } from '../constants/vehicle.constant';
import { VehicleTypeEnum } from '../constants/vehicleType.constant';
import { User } from '../user/user.entity';
import { UserRole } from '../constants/user.constant';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private checkVehicleOwnership(
    vehicle: Vehicle,
    user: User,
  ): void {
    if (user.role !== UserRole.Admin && vehicle.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this vehicle',
      );
    }
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const user = await this.userRepository.findOne({
      where: { id: createVehicleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createVehicleDto.userId} not found`,
      );
    }

    const existingVehicle = await this.vehicleRepository.findOne({
      where: { licensePlate: createVehicleDto.licensePlate },
    });

    if (existingVehicle) {
      throw new BadRequestException('License plate already exists');
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(user?: User): Promise<Vehicle[]> {
    if (user && user.role !== UserRole.Admin) {
      return this.vehicleRepository.find({
        where: { userId: user.id },
        relations: ['user'],
      });
    }
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

  async findActiveByUserId(userId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: {
        userId,
        status: VehicleStatus.Active,
      },
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

  async findActiveByVehicleType(
    vehicleType: VehicleTypeEnum,
  ): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: {
        vehicleType,
        status: VehicleStatus.Active,
      },
      relations: ['user'],
    });
  }

  async findActiveByVehicleTypeAndUserId(
    vehicleType: VehicleTypeEnum,
    userId: number,
  ): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: {
        vehicleType,
        userId,
        status: VehicleStatus.Active,
      },
      relations: ['user'],
    });
  }

  async findByVehicleTypeAndUserId(
    vehicleType: VehicleTypeEnum,
    userId: number,
  ): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: {
        vehicleType,
        userId,
      },
      relations: ['user'],
    });
  }

  async findOne(id: number, user: User): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    this.checkVehicleOwnership(vehicle, user);
    return vehicle;
  }

  async findByLicensePlate(licensePlate: string, user: User): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with license plate ${licensePlate} not found`,
      );
    }

    this.checkVehicleOwnership(vehicle, user);
    return vehicle;
  }

  async findByUserId(userId: number, user?: User): Promise<Vehicle[]> {
    if (user && user.role !== UserRole.Admin && user.id !== userId) {
      throw new ForbiddenException(
        "You do not have permission to view other users' vehicles",
      );
    }

    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
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
    user: User,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id, user);

    if (updateVehicleDto.userId && updateVehicleDto.userId !== vehicle.userId) {
      if (user.role !== UserRole.Admin) {
        throw new ForbiddenException('Only admin can change vehicle ownership');
      }

      const newUser = await this.userRepository.findOne({
        where: { id: updateVehicleDto.userId },
      });

      if (!newUser) {
        throw new NotFoundException(
          `User with ID ${updateVehicleDto.userId} not found`,
        );
      }
    }

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
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    vehicle.status = status;
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number, user: User): Promise<void> {
    const vehicle = await this.findOne(id, user);
    await this.vehicleRepository.remove(vehicle);
  }

  async activate(id: number): Promise<Vehicle> {
    return this.updateStatus(id, VehicleStatus.Active);
  }

  async deactivate(id: number): Promise<Vehicle> {
    return this.updateStatus(id, VehicleStatus.Inactive);
  }
}
