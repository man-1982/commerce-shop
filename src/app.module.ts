import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModule.register({
      // enable dev tools for dev environment
      http: process.env.NODE_ENV == 'development',
      port: 4000,
    }),
    // Import Config module @see https://docs.nestjs.com/techniques/configuration#custom-env-file-path
    ConfigModule.forRoot({
      isGlobal: true,
      //variable is found in multiple files, the first one takes precedence.
      envFilePath: ['.env.local', '.env'],
    }),
    ProductsModule,
    PrismaModule,
  ],
})
export class AppModule {}
