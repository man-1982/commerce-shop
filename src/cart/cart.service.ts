import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, CartDto, CreateCartDto, RemoveItemDto } from './dto';
import { Cart, Prisma, Product } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async createCart(dto: CreateCartDto) {
    const { uid, pid, quantity } = dto;

    return this.prisma.$transaction(async (tx) => {
      const existingCartItem = await tx.cart.findFirst({
        where: { uid, pid },
      });

      if (existingCartItem) {
        throw new HttpException(
          'Cart item already exists',
          HttpStatus.CONFLICT,
        );
      }

      const product = await this.getProduct(tx, pid);
      const price: number = product.price.toNumber();

      return tx.cart.create({
        data: {
          uid,
          pid,
          quantity,
          price,
          amount: new Prisma.Decimal(price * quantity),
          status: true,
        },
      });
    });
  }

  async addToCart(dto: AddToCartDto) {
    const { cid, pid, quantity } = dto;

    return this.prisma.$transaction(async (tx) => {
      const cartItem = await tx.cart.findFirst({
        where: { cid, pid },
      });

      if (!cartItem) {
        throw new HttpException(`Cart item not found`, HttpStatus.CONFLICT);
      }

      const product = await this.getProduct(tx, pid);
      const price: number = product.price.toNumber();

      const newQuantity = cartItem.quantity + quantity;
      return tx.cart.update({
        where: { cid: cartItem.cid },
        data: {
          quantity: newQuantity,
          amount: new Prisma.Decimal(price * newQuantity),
        },
      });
    });
  }

  /**
   * Get the product by id
   * @param tx
   * @param pid
   * @private
   */
  private async getProduct(
    tx: Prisma.TransactionClient,
    pid: number,
  ): Promise<Product> {
    const product = await tx.product.findUnique({ where: { pid } });
    if (!product) {
      throw new HttpException(
        `The product with ${pid} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return product;
  }

  /**
   * Get cart by id
   * @param cid
   * @param includeProduct
   */
  async getCart(cid: number, includeProduct: boolean = true) {
    const cart = await this.prisma.cart.findFirst({
      where: { cid: cid },
      include: {
        product: includeProduct,
      },
    });
    return cart;
  }

  /**
   * Remove/Update quantity of the product item from the cart
   * @param cid
   * @param removeItemDto
   */
  async removeItem(cid: number, removeItemDto: RemoveItemDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const cartByProduct = await tx.cart.findFirst({
        where: { cid: cid, pid: removeItemDto.pid },
        include: { product: true },
      });
      if (!cartByProduct) {
        throw new HttpException(
          `Product or cart doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const product = cartByProduct.product;
      const cart = tx.cart.update({
        where: { cid: cid, pid: removeItemDto.pid },
        data: {
          quantity: cartByProduct.quantity - removeItemDto.quantity,
          price: product.price,
          amount: new Prisma.Decimal(
            (cartByProduct.quantity - removeItemDto.quantity) *
              product.price.toNumber(),
          ),
        },
      });
      return cart;
    });
    return result;
  }

  async closeCart(cid: number) {
    try {
      const result = await this.prisma.cart.update({
        where: { cid: cid },
        data: { status: false },
      });

      return result;
    } catch (error) {
      // TODO: Response can have a vulnerability
      throw new HttpException(`Cart doesn't exist`, HttpStatus.BAD_REQUEST);
    }
  }
}
