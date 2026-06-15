import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        message = (b.message as string) || message;
        if (Array.isArray(b.message)) {
          details = b.message as string[];
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      details = Object.values(exception.errors).map((e) => e.message);
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid value for field '${exception.path}': ${exception.value}`;
    } else if (this.isDuplicateKeyError(exception)) {
      status = HttpStatus.CONFLICT;
      const field = this.extractDuplicateField(exception);
      message = field ? `${field} already exists` : 'Duplicate entry';
    } else {
      this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      statusCode: status,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    });
  }

  private isDuplicateKeyError(e: unknown): e is { code: number } {
    return typeof e === 'object' && e !== null && (e as Record<string, unknown>).code === 11000;
  }

  private extractDuplicateField(e: unknown): string | null {
    const err = e as Record<string, unknown>;
    const keyValue = err.keyValue as Record<string, unknown> | undefined;
    if (keyValue) {
      return Object.keys(keyValue)[0] ?? null;
    }
    return null;
  }
}
