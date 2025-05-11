import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createDataSource } from './data-source';
import { VehicleModule } from './vehicles/vehicle.module';
import { VehicleRatePlanModule } from './vehicleRatePlans/vehicle-rate-plan.module';
import { ParkingLotModule } from './parkingLots/parking-lot.module';
import { ParkingSlotModule } from './parkingSlot/parking-slot.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 cho phép sử dụng ở bất kỳ đâu không cần import lại
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return await createDataSource(configService);
      },
      inject: [ConfigService],
    }),
    UserModule,
    VehicleModule,
    VehicleRatePlanModule,
    ParkingLotModule,
    ParkingSlotModule,
  ],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Server started on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
