import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDueServices(carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { maintenanceRecords: true },
    });

    if (!car) return [];

    const rules = await this.prisma.maintenanceRule.findMany();

    return rules.filter((rule) => {
      const last = car.maintenanceRecords
        .filter((r) => r.serviceName === rule.serviceName)
        .sort((a, b) => b.mileageKm - a.mileageKm)[0];

      if (!last) return true;

      if (rule.intervalKm) {
        return car.mileageKm - last.mileageKm >= rule.intervalKm;
      }

      return false;
    });
  }

  recordService(carId: string, serviceName: string, mileageKm: number) {
    return this.prisma.maintenanceRecord.create({
      data: {
        carId,
        serviceName,
        mileageKm,
        performedAt: new Date(),
      },
    });
  }
}
