import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsOptional()
  @IsString()
  inventoryId?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  carId!: string;

  items!: CreateOrderItemDto[];
}
