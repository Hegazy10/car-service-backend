import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  list() {
    return this.servicesService.list();
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }
}
