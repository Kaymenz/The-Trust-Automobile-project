import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url} - IP: ${ip} - UA: ${userAgent}`);

    // Listen for client disconnect
    request.on('close', () => {
      const elapsed = Date.now() - now;
      if (!request.res.writableFinished) {
        this.logger.warn(
          `Client Disconnected Prematurely: ${method} ${url} - Elapsed: ${elapsed}ms`,
        );
      }
    });

    return next.handle().pipe(
      tap((data) => {
        const elapsed = Date.now() - now;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.logger.log(
          `Completed Request: ${method} ${url} - Status: ${statusCode} - Elapsed: ${elapsed}ms`,
        );
      }),
      catchError((error) => {
        const elapsed = Date.now() - now;
        const statusCode = error.status || 500;
        this.logger.error(
          `Failed Request: ${method} ${url} - Status: ${statusCode} - Elapsed: ${elapsed}ms - Error: ${error.message}`,
        );
        return throwError(() => error);
      }),
    );
  }
}
