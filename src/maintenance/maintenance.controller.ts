import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MaintenanceService } from './maintenance.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RecordMaintenanceDto } from './dto/record-maintenance.dto';

@ApiTags('Maintenance')
@ApiBearerAuth('JWT')
@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('due/:carId')
  @ApiOperation({ summary: 'Get due maintenance services for a car' })
  @ApiParam({
    name: 'carId',
    description: 'Car ID',
    example: 'c1a2b3d4-e5f6-7890-abcd-1234567890ab',
  })
  getDue(@Param('carId') carId: string) {
    return this.maintenanceService.getDueServices(carId);
  }

  @Post('record')
  @ApiOperation({ summary: 'Record a performed maintenance service' })
  @ApiBody({ type: RecordMaintenanceDto })
  record(@Body() dto: RecordMaintenanceDto) {
    return this.maintenanceService.recordService(
      dto.carId,
      dto.serviceName,
      dto.mileageKm,
    );
  }
}
