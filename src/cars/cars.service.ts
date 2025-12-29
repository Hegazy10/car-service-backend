import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateCarDto) {
    return this.prisma.car.create({
      data: {
        userId,
        modelId: dto.modelId,
        year: dto.year,
        mileageKm: dto.mileageKm,
      },
    });
  }

  findMyCars(userId: string) {
    return this.prisma.car.findMany({
      where: { userId },
      include: {
        model: {
          include: { brand: true },
        },
      },
    });
  }
}
