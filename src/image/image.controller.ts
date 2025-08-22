import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto, UpdateImageDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  /**
   * Create a new image.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new image' })
  @ApiBody({
    type: CreateImageDto,
    description: 'Data for creating a new image.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The image has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'The image too large. Limitation under 1Mb',
  })
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  /**
   * Find a single image by its ID.
   */
  @Get(':mid')
  @ApiOperation({ summary: 'Get a single image by its ID' })
  @ApiParam({ name: 'mid', required: true, description: 'The image ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully found the image.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not found.',
  })
  findOne(@Param('mid', ParseIntPipe) mid: number) {
    return this.imageService.findOne(mid);
  }

  /**
   * Find all images for a specific product.
   */
  @Get('product/:pid')
  @ApiOperation({ summary: 'Get all images for a specific product' })
  @ApiParam({ name: 'pid', required: true, description: 'The product ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully found images for the product.',
  })
  findForProduct(@Param('pid', ParseIntPipe) pid: number) {
    return this.imageService.findForProduct(pid);
  }

  /**
   * Update an image.
   */
  @Patch(':mid')
  @ApiOperation({ summary: 'Update an image' })
  @ApiParam({ name: 'mid', required: true, description: 'The image ID' })
  @ApiBody({
    type: UpdateImageDto,
    description: 'Data for updating an image.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The image has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not found.',
  })
  update(
    @Param('mid', ParseIntPipe) mid: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(mid, updateImageDto);
  }

  /**
   * Delete an image.
   */
  @Delete(':mid')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiParam({ name: 'mid', required: true, description: 'The image ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The image has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not found.',
  })
  remove(@Param('mid', ParseIntPipe) mid: number) {
    return this.imageService.remove(mid);
  }
}
