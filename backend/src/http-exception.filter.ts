import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const messages = {
      400: 'Неверный запрос',
      404: 'Ресурс не найден',
      500: 'Внутренняя ошибка сервера',
    };

    response.status(status).json({
      statusCode: status,
      message: messages[status] || exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}



