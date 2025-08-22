import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductListener } from './listeners/product.listener';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductListener],
})
export class ProductsModule {}
