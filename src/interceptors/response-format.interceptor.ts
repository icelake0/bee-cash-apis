
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {

  constructor(private successMessage = 'success') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          return !data.statusCode ? {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: this.successMessage,
            data:data
          } : data
        }),
      );
  }
}