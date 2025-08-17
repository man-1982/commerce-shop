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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  /**
   * Create a new product
   * @param product
   */
  @Post()
  @ApiBody({
    type: CreateProductDto,
    isArray: false,
    required: true,
    description: 'Create product',
  })
  create(@Body() product: CreateProductDto) {
    //console.log(product);
    this.products.create(product);
  }

  /**
   * Entirely update/replace product by pid
   * @param pid
   * @param product
   */
  @Patch(':pid')
  @ApiParam({ name: 'pid', required: true, description: 'Product id' })
  @ApiBody({
    type: UpdateProductDto,
    isArray: false,
    required: true,
    description: 'Update product by pid',
  })
  updateById(
    @Param('pid', new ParseIntPipe()) pid: number,
    @Body() product: UpdateProductDto,
  ) {
    return this.products.updateById(pid, product);
  }

  /**
   * Find product by product pid
   * @param pid
   */
  @Get(':pid')
  @ApiParam({ name: 'pid', required: true, description: 'Product id' })
  findById(@Param('pid', new ParseIntPipe()) pid: number) {
    return { msg: 'findById' };
  }

  @Delete(':pid')
  @ApiOperation({ summary: 'Delete product by pid' })
  @ApiParam({ name: 'pid', required: true, description: 'Product id' })
  deleteById(@Param('pid', new ParseIntPipe({})) pid: number) {
    return { msg: 'deleteById' };
  }
}
