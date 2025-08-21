import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImageDto } from './dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    const { pid, imageData, title } = createImageDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { pid: pid },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${pid} not found`);
    }

    return this.prisma.image.create({
      data: {
        imageData,
        title,
        product: {
          connect: { pid: pid },
        },
      },
    });
  }

  async findOne(mid: number) {
    const image = await this.prisma.image.findUnique({
      where: { mid: mid },
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${mid} not found`);
    }
    return image;
  }

  async findForProduct(pid: number) {
    return this.prisma.image.findMany({
      where: { pid: pid },
    });
  }
}
