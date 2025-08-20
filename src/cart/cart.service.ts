import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, CartDto, CreateCartDto, RemoveItemDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(dto: AddToCartDto | CreateCartDto) {
    const { uid, pid } = dto;
    const quantity = dto.quantity;

    const result = await this.prisma.$transaction(async (tx) => {
      // TODO: Avoid references to product table
      const product = await tx.product.findUnique({ where: { pid } });
      if (!product)
        throw new HttpException(
          `The product with ${pid} not found`,
          HttpStatus.BAD_REQUEST,
        );
      // by default product.price is prisma.decimal
      const price: number = product.price.toNumber();

      let cart = await tx.cart.findFirst({
        where: { uid: uid, pid: pid },
      });

      if (cart) {
        // get total quantity
        const newQuantity = cart.quantity + quantity;
        cart = await tx.cart.update({
          where: { cid: cart.cid },
          data: {
            quantity: newQuantity,
            amount: new Prisma.Decimal(price * newQuantity),
          },
        });
      } else {
        cart = await tx.cart.create({
          data: {
            uid: uid,
            pid: pid,
            quantity: quantity,
            price: price,
            amount: new Prisma.Decimal(price * quantity),
            status: true,
          },
        });
      }
      return cart;
    });

    return result;
  }

  async getCart(cid: number, includeProduct: boolean = true) {
    const cart = await this.prisma.cart.findFirst({
      where: { cid: cid },
      include: {
        product: includeProduct,
      },
    });
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
    return result;
  }

  async closeCart(cid: number): Promise<CartDto> {
    const result = await this.prisma.cart.update({
      where: { cid: cid },
      data: { status: false },
    });

    const cart = new CartDto();
    // Convert prisma.decimal to number
    Object.keys(result).map((value) => {
      if (cart[value] instanceof Prisma.Decimal) {
        cart[value] = cart[value].toNumber();
      }
    });
    return cart;
  }
}
