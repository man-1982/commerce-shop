import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as process from 'node:process';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    CartModule,
    EventEmitterModule.forRoot({
      verboseMemoryLeak: process.env.NODE_ENV === 'development',
      ignoreErrors: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
