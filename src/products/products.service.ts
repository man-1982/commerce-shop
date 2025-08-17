import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  private _pid: number;
  constructor() {}

  public create(product: CreateProductDto) {
    return {
      msg: 'all good',
    };
  }

  public updateById(pid: number, product: UpdateProductDto) {
    return {
      msg: 'all good',
    };
  }
}
