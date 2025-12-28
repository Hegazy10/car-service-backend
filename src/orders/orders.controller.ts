import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { AuthUser } from '../auth/types/auth-user.type';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth('JWT')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(
    @Req() req: Request & { user: AuthUser },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my orders (paginated)' })
  mine(
    @Req() req: Request & { user: AuthUser },
    @Query() pagination: PaginationDto,
  ) {
    return this.ordersService.listMine(req.user.userId, pagination);
  }
}
