import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInventoryOrService } from './order-item.validator';

@IsInventoryOrService()
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
  @IsString().slice(________)
  carId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
