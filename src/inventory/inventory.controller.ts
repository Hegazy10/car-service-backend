import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List inventory items' })
  list(@Query() pagination: PaginationDto) {
    return this.inventoryService.list(pagination);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new inventory item (Admin only)' })
  @ApiBody({ type: CreateInventoryDto })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }
}
