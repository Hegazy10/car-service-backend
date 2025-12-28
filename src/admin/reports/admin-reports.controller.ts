import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminReportsService } from './admin-reports.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin / Reports')
@ApiBearerAuth('JWT')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminReportsController {
  constructor(private readonly reportsService: AdminReportsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue summary (Admin only)' })
  revenue() {
    return this.reportsService.revenueSummary();
  }

  @Get('top-services')
  @ApiOperation({
    summary: 'Get top services by usage or revenue (Admin only)',
  })
  topServices() {
    return this.reportsService.topServices();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get inventory items with low stock (Admin only)' })
  lowStock() {
    return this.reportsService.lowStockItems();
  }
}
