import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(product: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data: product });
  }

  async updateById(pid: number, product: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { pid: pid },
      data: product,
    });
  }
  async findById(pid: number): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: { pid: pid },
    });
  }

  async deleteById(pid: number): Promise<null> {
    const product = await this.prisma.product.delete({
      where: { pid: pid },
    });
    return null;
  }
}
