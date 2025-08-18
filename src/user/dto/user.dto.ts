import {
  ApiExtraModels,
  ApiProperty,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The user ID .',
  })
  uid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'some-uuid-string',
    description: 'The unique uuid of the user.',
  })
  uuid: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: () => {
      const randomString = Math.random().toString(36).substring(2, 15);
      return `user_${randomString}@example.com`;
    },
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  readonly email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'Str0ngP@ssw0rd!',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64) // TODO: Add default if possible
  @ApiProperty({
    description: 'User role',
    example: 'authorised',
    default: 'authorised',
  })
  role: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The true or false status of the product.',
  })
  status?: boolean = true;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The creation date of the user.',
  })
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The last update date of the user.',
  })
  updatedAt: Date;
}

export class UpdateUserDto extends OmitType(UserDto, [
  'uid',
  'email',
  'uuid',
  'updatedAt',
  'createdAt',
] as const) {}

export class CreateUserDto extends PickType(UserDto, [
  'email',
  'password',
] as const) {}
