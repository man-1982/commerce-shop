import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService, Product } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({ data: product });
    this.eventEmitter.emit('product.created', newProduct);
    return newProduct;
  }

  async updateById(pid: number, product: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.prisma.product.update({
      where: { pid: pid },
      data: product,
    });
    this.eventEmitter.emit('product.updated', updatedProduct);
    return updatedProduct;
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
    this.eventEmitter.emit('product.deleted', product);
    return null;
  }
}
