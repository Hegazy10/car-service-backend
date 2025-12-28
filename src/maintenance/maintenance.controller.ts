import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('due/:carId')
  getDue(@Param('carId') carId: string) {
    return this.maintenanceService.getDueServices(carId);
  }

  @Post('record')
  record(
    @Body()
    body: {
      carId: string;
      serviceName: string;
      mileageKm: number;
    },
  ) {
    return this.maintenanceService.recordService(
      body.carId,
      body.serviceName,
      body.mileageKm,
    );
  }
}
