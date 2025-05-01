import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RobloxModule } from './roblox/roblox.module';

@Module({
  imports: [
    HttpModule.register({ // Конфигурация HttpModule
      timeout: 5000,
      maxRedirects: 5,
    }),
    RobloxModule,
  ],
})
export class AppModule {}