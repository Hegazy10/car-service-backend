import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class RecordMaintenanceDto {
  @ApiProperty({ example: 'c1a2b3d4-e5f6-7890-abcd-1234567890ab' })
  @IsUUID()
  carId!: string;

  @ApiProperty({ example: 'Oil Change' })
  @IsString()
  serviceName!: string;

  @ApiProperty({ example: 45000 })
  @IsInt()
  @Min(0)
  mileageKm!: number;
}
