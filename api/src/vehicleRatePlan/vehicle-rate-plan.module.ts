import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleRatePlanService } from './vehicle-rate-plan.service';
import { VehicleRatePlanController } from './vehicle-rate-plan.controller';
import { VehicleRatePlan } from './vehicleRatePlan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleRatePlan])],
  controllers: [VehicleRatePlanController],
  providers: [VehicleRatePlanService],
  exports: [VehicleRatePlanService],
})
export class VehicleRatePlanModule {}