import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const videosPath = path.join(__dirname, '..', 'uploads', 'videos');
  app.use('/uploads/videos', express.static(videosPath));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
