import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // enable dev tools for dev environment
    snapshot: process.env.NODE_ENV === 'development',
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentation')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
  //Use global pipes in the DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
