import { Injectable } from '@nestjs/common';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUser: CreateUserDto): Promise<UserDto> {
    return this.prisma.user.create({ data: createUser });
  }

  async findById(id: number): Promise<UserDto | null> {
    return this.prisma.user.findFirst({ where: { uid: id } });
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<UserDto> {
    return this.prisma.user.update({
      where: { uid: id },
      data: updateUser,
    });
  }

  async remove(id: number): Promise<null> {
    await this.prisma.user.delete({ where: { uid: id } });
    return null;
  }
}
