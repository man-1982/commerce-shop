import { Injectable } from '@nestjs/common';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUser: CreateUserDto): Promise<UserDto> {
    const newUser = await this.prisma.user.create({ data: createUser });
    this.eventEmitter.emit('user.created', newUser);
    return newUser;
  }

  async findById(id: number): Promise<UserDto | null> {
    return this.prisma.user.findFirst({ where: { uid: id } });
  }

  async update(id: number, updateUser: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.prisma.user.update({
      where: { uid: id },
      data: updateUser,
    });
    this.eventEmitter.emit('user.updated', updatedUser);
    return updatedUser;
  }

  async remove(id: number): Promise<null> {
    const deletedUser = await this.prisma.user.delete({ where: { uid: id } });
    this.eventEmitter.emit('user.deleted', deletedUser);
    return null;
  }
}
