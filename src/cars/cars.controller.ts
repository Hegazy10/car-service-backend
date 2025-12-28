import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { Request } from 'express';
import { AuthUser } from '../auth/types/auth-user.type';

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  create(@Req() req: Request & { user: AuthUser }, @Body() dto: CreateCarDto) {
    return this.carsService.create(req.user.userId, dto);
  }

  @Get()
  myCars(@Req() req: Request & { user: AuthUser }) {
    return this.carsService.findMyCars(req.user.userId);
  }
}
