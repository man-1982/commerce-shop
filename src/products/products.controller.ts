import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from '../prisma/prisma.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  /**
   * Create a new product.
   * @param product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateProductDto,
    isArray: false,
    required: true,
    description: 'Create product',
  })
  create(@Body() product: CreateProductDto): Promise<Product> {
    //console.log(product);
    return this.products.create(product);
  }

  /**
   * Entirely update/replace product by pid.
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
  ): Promise<Product> {
    return this.products.updateById(pid, product);
  }

  /**
   * Find product by product pid.
   * @param pid
   */
  @Get(':pid')
  @ApiParam({ name: 'pid', required: true, description: 'Product id' })
  findById(
    @Param('pid', new ParseIntPipe()) pid: number,
  ): Promise<Product | null> {
    return this.products.findById(pid);
  }

  @Delete(':pid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product by pid' })
  @ApiParam({ name: 'pid', required: true, description: 'Product id' })
  deleteById(@Param('pid', new ParseIntPipe({})) pid: number): Promise<null> {
    return this.products.deleteById(pid);
  }
}
