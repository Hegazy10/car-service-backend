import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  list(pagination: PaginationDto) {
    const { skip = 0, take = 20 } = pagination;

    return this.prisma.service.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // recommended
    });
  }
}
