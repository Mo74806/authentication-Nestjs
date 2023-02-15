import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/authdb'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
