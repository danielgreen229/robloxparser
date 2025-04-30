import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

@Injectable()
export class RobloxInterceptor implements NestInterceptor {
  private readonly ROBLOX_DOMAINS = ['roblox.com', 'roproxy.com'];

  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.httpService.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (config.url && this.isRobloxRequest(config.url)) {
          // Создаем новый объект заголовков
          const headers = new AxiosHeaders();
          
          // Копируем существующие заголовки
          if (config.headers) {
            headers.set(config.headers);
          }
          
          // Устанавливаем наши кастомные заголовки
          headers.set('accept-language', 'ru,en;q=0.9,en-US;q=0.8,ru-RU;q=0.7');
          headers.set('x-custom-request-from', 'nestjs-server');
          
          config.headers = headers;
        }
        return config;
      }
    );

    return next.handle();
  }

  private isRobloxRequest(url: string): boolean {
    return this.ROBLOX_DOMAINS.some(domain => url.includes(domain));
  }
}