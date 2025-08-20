import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AddToCartDto, CreateCartDto, RemoveItemDto } from './dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /*
  Add item to the cart or create new cart with item.
  Also set up status to true for the closed cart.
   */
  @Post('add')
  @ApiBody({
    type: AddToCartDto,
    description:
      'Add product to the cart or create new cart. Setup status closed cart to active',
  })
  @ApiOperation({
    summary:
      'Add product to the cart or create new cart. Also update status closed cart to active',
  })
  addToCart(@Body() addToCartDto: AddToCartDto | CreateCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  /*
  Get cart with product list
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
  getCart(@Param('cid', ParseIntPipe) cid: number) {
    return this.cartService.getCart(cid);
  }

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
  @Patch(':id/close')
  closeCart(@Param('cid', ParseIntPipe) cid: number) {
    return this.cartService.closeCart(cid);
  }
}
