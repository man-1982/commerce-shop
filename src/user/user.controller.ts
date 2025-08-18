import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseEnumPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserDto, UpdateUserDto } from './dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * @param createUser
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateUserDto,
    isArray: false,
    required: true,
    description: 'Create new user',
  })
  create(@Body() createUser: CreateUserDto): Promise<UserDto> {
    // TODO Needed investigate: Send data with same email twice,
    //  have an error and id jump on 1 forward
    return this.userService.create(createUser);
  }

  @Get(':uid')
  findById(
    @Param('uid', new ParseIntPipe()) id: number,
  ): Promise<UserDto | null> {
    return this.userService.findById(id);
  }

  // TODO Add custom error handler
  @Patch(':uid')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: UpdateUserDto,
    isArray: false,
    required: true,
    description: 'Update user',
  })
  update(
    @Param('uid', new ParseIntPipe()) id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUser);
  }

  @Delete(':uid')
  @ApiExtraModels(CreateUserDto)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete User by UID' })
  @ApiParam({ name: 'uid', required: true, description: 'User id' })
  remove(@Param('uid', new ParseIntPipe()) id: number): Promise<null> {
    return this.userService.remove(id);
  }
}
