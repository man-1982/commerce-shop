import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get(':mid')
  findOne(@Param('mid', ParseIntPipe) mid: number) {
    return this.imageService.findOne(mid);
  }

  @Get('product/:pid')
  findForProduct(@Param('pid', ParseIntPipe) pid: number) {
    return this.imageService.findForProduct(pid);
  }
}
