import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async revenueSummary() {
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'COMPLETED' },
    });

    const orderCount = await this.prisma.order.count({
      where: { status: 'COMPLETED' },
    });

    return {
      totalRevenue: totalRevenue._sum.totalPrice ?? 0,
      completedOrders: orderCount,
    };
  }

  async topServices() {
    return this.prisma.orderItem.groupBy({
      by: ['serviceId'],
      _sum: { quantity: true },
      where: { serviceId: { not: null } },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });
  }

  async lowStockItems(threshold = 5) {
    return this.prisma.part.findMany({
      where: {
        quantity: { lte: threshold },
      },
    });
  }
}
