import { IsInt, IsOptional, IsString, Min, Validate } from 'class-validator';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryOrServiceValidator } from './order-item.validator';

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

  @Validate(InventoryOrServiceValidator)
  _xorCheck!: true;
}

export class CreateOrderDto {
  @IsString()
  carId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
