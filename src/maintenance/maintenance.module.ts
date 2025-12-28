import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceJobs } from './maintenance.jobs';

@Module({
  providers: [MaintenanceService, MaintenanceJobs],
  controllers: [MaintenanceController],
})
export class MaintenanceModule {}
