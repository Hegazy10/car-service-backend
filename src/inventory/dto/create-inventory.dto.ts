import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum InventoryType {
  PART = 'PART',
  SERVICE = 'SERVICE',
}

export enum ServiceCategory {
  OIL = 'OIL',
  BATTERY = 'BATTERY',
  TIRE = 'TIRE',
  OTHER = 'OTHER',
}

export class CreateInventoryDto {
  @IsString()
  name!: string;

  @IsEnum(InventoryType)
  type!: InventoryType;

  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsNumber()
  price!: number;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsInt()
  @Min(0)
  deliveryDays!: number;
}
