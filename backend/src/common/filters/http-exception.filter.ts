import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCode } from '../errors/error-code.js';

type ErrorPayload = {
  code?: string;
  message?: string | string[];
  details?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = this.getPayload(exception);

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      statusCode,
      code:
        payload.code ??
        (statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? ErrorCode.InternalServerError
          : `HTTP_${statusCode}`),
      message: this.getMessage(payload.message, statusCode),
      ...(payload.details === undefined ? {} : { details: payload.details }),
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }

  private getPayload(exception: unknown): ErrorPayload {
    if (!(exception instanceof HttpException)) {
      return {};
    }

    const response = exception.getResponse();
    return typeof response === 'string' ? { message: response } : response;
  }

  private getMessage(
    message: string | string[] | undefined,
    statusCode: number,
  ): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    if (message) {
      return message;
    }
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'An unexpected error occurred';
    }
    return 'Request failed';
  }
}
