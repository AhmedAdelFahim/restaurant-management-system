import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { exceptionMapper } from 'unified-errors-handler';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exceptionMapper(exception, {
      parseMongooseExceptions: true,
      loggerOptions: {
        console: {
          colored: true,
        },
      },
    });
    response.status(error.statusCode).json({
      errors: error.serializeErrors(),
    });
  }
}
