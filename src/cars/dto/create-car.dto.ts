import { IsInt, IsString, Min } from 'class-validator';

export class CreateCarDto {
  @IsString()
  modelId!: string;

  @IsInt()
  @Min(1900)
  year!: number;

  @IsInt()
  @Min(0)
  mileageKm!: number;
}
