import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, CartDto, CreateCartDto, RemoveItemDto } from './dto';
import { Cart, Prisma, Product } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createCart(dto: CreateCartDto) {
    const newCart = await this.prisma.$transaction(async (tx) => {
      const { uid, pid, quantity } = dto;

      const existingCart = await tx.cart.findFirst({
        where: { uid, pid },
      });

      if (existingCart) {
        throw new HttpException('Cart already exists', HttpStatus.CONFLICT);
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

    // Notification: Cart created
    this.eventEmitter.emit('cart.created', { cart: newCart });

    // Notification: Cart items were updated
    this.eventEmitter.emit('cart.items.updated', {
      item: {
        pid: newCart.pid,
        cid: newCart.cid,
        quantity: newCart.quantity,
      },
    });
    return newCart;
  }

  async addToCart(dto: AddToCartDto) {
    const updatedCartItem = await this.prisma.$transaction(async (tx) => {
      const { uid, pid, quantity } = dto;

      const cartItem = await tx.cart.findFirst({
        where: { uid, pid },
      });

      if (!cartItem) {
        throw new HttpException(`Cart item not found`, HttpStatus.NOT_FOUND);
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

    this.eventEmitter.emit('cart.items.updated', {
      item: {
        pid: updatedCartItem.pid,
        cid: updatedCartItem.cid,
        quantity: dto.quantity,
      },
    });
    return updatedCartItem;
  }

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

  async getCart(cid: number, includeProduct: boolean = true) {
    const cart = await this.prisma.cart.findFirst({
      where: { cid: cid },
      include: {
        product: includeProduct,
      },
    });
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  /*
  Remove some quantity of the product from the cart
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

    // Notification: Cart items were updated
    this.eventEmitter.emit('cart.items.updated', {
      item: {
        pid: result.pid,
        cid: result.cid,
        quantity: -removeItemDto.quantity,
      },
    });

    return result;
  }

  async closeCart(cid: number): Promise<CartDto> {
    const result = await this.prisma.cart.update({
      where: { cid: cid, status: true },
      data: { status: false },
    });

    const cart: CartDto = {
      ...result,
      price: result.price.toNumber(),
      amount: result.amount.toNumber(),
    };
    // Notification: Cart closed
    this.eventEmitter.emit('cart.closed', { cart: cart });

    return cart;
  }

  /**
   *  Delete cart by cid
   * @param cid
   */
  async deleteCart(cid: number): Promise<void> {
    const cart = await this.getCart(cid);
    const deletedCart = await this.prisma.cart.delete({
      where: { cid: cid },
    });
    const cartDto: CartDto = {
      ...cart,
      price: cart.price.toNumber(),
      amount: cart.amount.toNumber(),
    };
    // Notification: Cart deleted
    this.eventEmitter.emit('cart.deleted', { cart: cartDto });
  }
}
