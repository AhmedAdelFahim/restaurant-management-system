import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AllExceptionFilter } from './filters/all-exception-filter';
// import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  // app.setGlobalPrefix('api');
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port');
  await app.listen(port);
  // mongoose.set('debug', true);
  Logger.verbose(`app started on port: ${port}`);
}
bootstrap();
