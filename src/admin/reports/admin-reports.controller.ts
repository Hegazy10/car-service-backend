import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminReportsController {
  constructor(private readonly reportsService: AdminReportsService) {}

  @Get('revenue')
  revenue() {
    return this.reportsService.revenueSummary();
  }

  @Get('top-services')
  topServices() {
    return this.reportsService.topServices();
  }

  @Get('low-stock')
  lowStock() {
    return this.reportsService.lowStockItems();
  }
}
