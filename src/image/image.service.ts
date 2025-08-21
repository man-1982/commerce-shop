import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto, UpdateImageDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new image and associates it with a product.
   * @param createImageDto - DTO for creating an image.
   * @returns The created image.
   */
  async create(createImageDto: CreateImageDto) {
    const { pid, imageData, title } = createImageDto;

    // if product exists
    const product = await this.prisma.product.findUnique({
      where: { pid: pid },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${pid} not found`);
    }

    const image = await this.prisma.image.create({
      data: {
        imageData,
        title,
        product: {
          connect: { pid: pid },
        },
      },
    });

    // Emitter for image creation
    this.eventEmitter.emit('image.created', image);
    return image;
  }

  /**
   * Single image by its ID.
   * @param mid - The image ID.
   * @returns The found image.
   */
  async findOne(mid: number) {
    const image = await this.prisma.image.findUnique({
      where: { mid: mid },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${mid} not found`);
    }
    return image;
  }

  /**
   * All images for a given product.
   * @param pid - The product ID.
   * @returns A list of images.
   */
  async findForProduct(pid: number) {
    return this.prisma.image.findMany({
      where: { pid: pid },
    });
  }

  /**
   * Updates an image's data.
   * @param mid - The ID of the image to update.
   * @param updateImageDto - DTO with updated image data.
   * @returns The updated image.
   */
  async update(mid: number, updateImageDto: UpdateImageDto) {
    const image = await this.prisma.image.update({
      where: { mid: mid },
      data: updateImageDto,
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${mid} not found`);
    }

    // Emit an event for image update
    this.eventEmitter.emit('image.updated', image);
    return image;
  }

  /**
   * Removes an image.
   * @param mid - The ID of the image to remove.
   * @returns The removed image.
   */
  async remove(mid: number) {
    const image = await this.prisma.image.delete({
      where: { mid: mid },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${mid} not found`);
    }

    // Emitter image deletion
    this.eventEmitter.emit('image.deleted', image);
    return image;
  }
}
