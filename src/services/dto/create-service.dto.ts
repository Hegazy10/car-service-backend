import { IsEnum, IsNumber, IsString } from 'class-validator';
import { ServiceCategory } from '../../inventory/dto/create-inventory.dto';

export class CreateServiceDto {
  @IsString()
  name!: string;

  @IsEnum(ServiceCategory)
  category!: ServiceCategory;

  @IsNumber()
  basePrice!: number;
}
