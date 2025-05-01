import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RobloxInterceptor } from './common/interceptors/roblox.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const httpService = app.get(HttpService);
  
  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  
  // Регистрируем глобальный интерсептор
  app.useGlobalInterceptors(new RobloxInterceptor(httpService));
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();