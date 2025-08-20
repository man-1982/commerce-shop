import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddToCartDto, CreateCartDto, RemoveItemDto } from './dto';
import { Cart } from '@prisma/client';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiBody({
    type: CreateCartDto,
    description: 'Create a new cart with an initial item.',
  })
  @ApiOperation({
    summary: 'Create a new cart with an initial item.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cart for the user already exists',
  })
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  /**
   * Add to cart.
   * @param addToCartDto
   */
  @Patch('add')
  @ApiBody({
    type: AddToCartDto,
    description: 'Add quantity to an existing item in the cart.',
  })
  @ApiOperation({
    summary: 'Add quantity to an existing item in the cart.',
  })
  addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  /**
   * Get user cart
   * @param cid
   */
  @Get(':cid')
  @ApiParam({
    name: 'cid',
    required: true,
    description: 'The cart id',
  })
  @ApiOperation({
    summary: 'Get product from the cart.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully found',
  })
  getCart(@Param('cid', ParseIntPipe) cid: number): Promise<Cart | null> {
    return this.cartService.getCart(cid);
  }

  /**
   * Remove/Update quantity of the product item from the cart
   * @param cid
   * @param removeItemDto
   */
  @ApiParam({
    name: 'cid',
    required: true,
    description: 'The cart id',
  })
  @ApiOperation({
    summary: 'Remove product from the cart by product id.',
  })
  @ApiBody({
    type: RemoveItemDto,
    description: 'Remove product from the cart by product id.',
  })
  @Delete(':cid/item')
  removeItem(
    @Param('cid', ParseIntPipe) cid: number,
    @Body() removeItemDto: RemoveItemDto,
  ) {
    return this.cartService.removeItem(cid, removeItemDto);
  }

  @ApiParam({
    name: 'cid',
    required: true,
    description: 'The cart id for close',
  })
  @ApiOperation({
    summary: 'Change status cart to false or closed',
  })
  @Patch(':cid/close')
  closeCart(@Param('cid', ParseIntPipe) cid: number) {
    return this.cartService.closeCart(cid);
  }
}
