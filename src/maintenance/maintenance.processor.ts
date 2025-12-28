import { Worker } from 'bullmq';
import { redisConnection } from '../common/queues/queue.module';
import { PrismaService } from '../../prisma/prisma.service';

interface MaintenanceJobData {
  carId: string;
}

new Worker<MaintenanceJobData>(
  'maintenance',
  async (job) => {
    const prisma = new PrismaService();

    const { carId } = job.data;

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { maintenanceRecords: true },
    });

    if (!car) return;

    const rules = await prisma.maintenanceRule.findMany();

    for (const rule of rules) {
      const last = car.maintenanceRecords
        .filter((r) => r.serviceName === rule.serviceName)
        .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())[0];

      if (!last) {
        console.log(`Maintenance due: ${rule.serviceName}`);
        continue;
      }

      if (
        rule.intervalKm &&
        car.mileageKm - last.mileageKm >= rule.intervalKm
      ) {
        console.log(`Maintenance due by KM: ${rule.serviceName}`);
      }
    }
  },
  { connection: redisConnection },
);
