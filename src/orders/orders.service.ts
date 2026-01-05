import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      const order = await tx.order.create({
        data: {
          userId,
          carId: dto.carId,
          totalPrice: 0,
        },
      });

      for (const item of dto.items) {
        if (item.inventoryId) {
          const inv = await tx.part.findUnique({
            where: { id: item.inventoryId },
          });

          if (!inv || inv.quantity < item.quantity) {
            throw new BadRequestException('Stock issue');
          }

          await tx.part.update({
            where: { id: inv.id },
            data: { quantity: { decrement: item.quantity } },
          });

          total += Number(inv.price) * item.quantity;

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              partId: inv.id,
              quantity: item.quantity,
              price: inv.price,
            },
          });
        }

        if (item.serviceId) {
          const svc = await tx.service.findUnique({
            where: { id: item.serviceId },
          });

          if (!svc) throw new BadRequestException('Service missing');

          total += Number(svc.basePrice) * item.quantity;

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              serviceId: svc.id,
              quantity: item.quantity,
              price: svc.basePrice,
            },
          });
        }
      }

      return tx.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED', totalPrice: total },
      });
    });
  }

  listMine(userId: string, pagination: PaginationDto) {
    const { skip = 0, take = 20 } = pagination;

    return this.prisma.order.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // recommended
      include: {
        items: true,
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
