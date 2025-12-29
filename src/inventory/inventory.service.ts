import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInventoryDto) {
    return this.prisma.inventoryItem.create({
      data: {
        name: dto.name,
        type: dto.type,
        category: dto.category || null,
        price: dto.price,
        quantity: dto.quantity,
        deliveryDays: dto.deliveryDays,
      },
    });
  }

  list(pagination: PaginationDto) {
    const { skip = 0, take = 20 } = pagination;

    return this.prisma.inventoryItem.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // recommended
    });
  }

  async deductStock(itemId: string, quantity: number) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: { quantity: { decrement: quantity } },
    });
  }
}
