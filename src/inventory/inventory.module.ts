import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { StockJobs } from './stock.jobs';

@Module({
  providers: [InventoryService, StockJobs],
  controllers: [InventoryController],
})
export class InventoryModule {}
