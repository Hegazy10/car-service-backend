import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Services')
@ApiBearerAuth('JWT')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'List available services' })
  list(@Query() pagination: PaginationDto) {
    return this.servicesService.list(pagination);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new service (Admin only)' })
  @ApiBody({ type: CreateServiceDto })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }
}
