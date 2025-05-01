import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RobloxService } from './roblox.service';
import { RobloxController } from './roblox.controller';

@Module({
  imports: [HttpModule], // Добавляем импорт HttpModule
  controllers: [RobloxController],
  providers: [RobloxService],
})
export class RobloxModule {}