import { PartialType } from '@nestjs/swagger';

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CartDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the cart.',
  })
  cid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'fd3e4f36-b9b6-4937-959f-ead5ba6ed4b2',
    description: 'The unique uuid of the cart.',
  })
  uuid: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who owns the cart.',
  })
  uid: number;

  @IsInt()
  @Min(0)
  @IsOptional({ message: 'It is  default to 1 on create' })
  quantity: number;

  @IsPositive()
  @Type(() => Number)
  // Ensures transformation from string if needed (e.g., from query params or form-data)
  price: number;

  @IsPositive()
  @Type(() => Number)
  // Ensures transformation from string if needed (e.g., from query params or form-data)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 11,
    description: 'The pid of the product in the cart.',
  })
  pid: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The true or false status of the cart.',
  })
  @Type(() => Boolean)
  status?: boolean = true;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The creation date of the cart.',
  })
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The last update date of the cart.',
  })
  updatedAt: Date;
}

export class CreateCartDto extends OmitType(CartDto, [
  'cid',
  'uuid',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateCartDto extends PartialType(CreateCartDto) {}
