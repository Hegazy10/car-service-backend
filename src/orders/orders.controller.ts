import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthUser } from '../auth/types/auth-user.type';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Req() req: Request & { user: AuthUser },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @Get()
  mine(@Req() req: Request & { user: AuthUser }) {
    return this.ordersService.listMine(req.user.userId);
  }
}
