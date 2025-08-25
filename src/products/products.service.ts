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

  /**
   * Create new product
   * @param product
   */
  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({ data: product });
    this.eventEmitter.emit('product.created', newProduct);
    return newProduct;
  }

  /**
   * Update product details
   * @param pid
   * @param product
   */
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

  /**
   * Deleted product by pi
   * @param pid
   */
  async deleteById(pid: number): Promise<null> {
    const product = await this.prisma.product.delete({
      where: { pid: pid },
    });
    this.eventEmitter.emit('product.deleted', product);
    return null;
  }

  /**
   * Update product stock/stock
   * @param pid
   * @param stockChange
   */
  async updateProductStock(pid: number, stockChange: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { pid: pid },
      select: { stock: true },
    });

    if (!product) {
      throw new Error(`Product with ID ${pid} not found.`);
    }

    const newStock = product.stock + stockChange;

    return this.prisma.product.update({
      where: { pid: pid },
      data: { stock: newStock },
    });
  }
}
