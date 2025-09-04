import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService, Product } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create new product
   * @param product
   */
  async create(product: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating product: ${JSON.stringify(product)}`);
    const newProduct = await this.prisma.product.create({ data: product });
    this.eventEmitter.emit('product.created', newProduct);
    this.logger.log(`Product created: ${JSON.stringify(newProduct)}`);
    return newProduct;
  }

  /**
   * Update product details
   * @param pid
   * @param product
   */
  async updateById(pid: number, product: UpdateProductDto): Promise<Product> {
    this.logger.log(`Updating product ${pid}: ${JSON.stringify(product)}`);
    const updatedProduct = await this.prisma.product.update({
      where: { pid: pid },
      data: product,
    });
    this.eventEmitter.emit('product.updated', updatedProduct);
    this.logger.log(`Product updated: ${JSON.stringify(updatedProduct)}`);
    return updatedProduct;
  }
  async findById(pid: number): Promise<Product | null> {
    this.logger.log(`Finding product by ID: ${pid}`);
    const product = await this.prisma.product.findFirst({
      where: { pid: pid },
    });
    this.logger.log(`Product found: ${JSON.stringify(product)}`);
    return product;
  }

  /**
   * Deleted product by pi
   * @param pid
   */
  async deleteById(pid: number): Promise<null> {
    this.logger.log(`Deleting product: ${pid}`);
    const product = await this.prisma.product.delete({
      where: { pid: pid },
    });
    this.eventEmitter.emit('product.deleted', product);
    this.logger.log(`Product deleted: ${JSON.stringify(product)}`);
    return null;
  }

  /**
   * Update product stock/stock
   * @param pid
   * @param stockChange
   */
  async updateProductStock(pid: number, stockChange: number): Promise<Product> {
    this.logger.log(`Updating stock for product ${pid}, change: ${stockChange}`);
    const product = await this.prisma.product.findUnique({
      where: { pid: pid },
      select: { stock: true },
    });

    if (!product) {
      this.logger.error(`Product with ID ${pid} not found.`);
      throw new Error(`Product with ID ${pid} not found.`);
    }

    const newStock = product.stock + stockChange;
    const updatedProduct = await this.prisma.product.update({
      where: { pid: pid },
      data: { stock: newStock },
    });
    this.logger.log(`Product stock updated: ${JSON.stringify(updatedProduct)}`);
    return updatedProduct;
  }
}
