import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongooseError } from 'mongoose';
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // app.use(
  //   cookieSession({
  //     keys: ['asdfasfd'],
  //   }),
  // );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
