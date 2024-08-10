import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, throwError } from 'rxjs';
import { IResponse } from './interfaces/response.interface';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((response: IResponse) => {
        if (!response.statusCode) response.statusCode = HttpStatus.OK;
        return {
          statusCode: response.statusCode,
          message: response.message,
          data: response.data,
        };
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
