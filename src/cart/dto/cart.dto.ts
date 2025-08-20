import { PartialType } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/swagger/dist/type-helpers/pick-type.helper';

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
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  // It was my attempt to avoid Compile-tip[e error about prisma.decimal to number
  // @Transform(({ value }) => {
  //   if (value && typeof value.toNumber === 'function') {
  //     return value.toNumber();
  //   }
  //   return value;
  // }) // Transfor Prisma.decimal => number
  price: number;

  @Type(() => Number) // type decorator should go first
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  // Ensures transformation from string if needed (e.g., from query params or form-data)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
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

export class CreateCartDto extends PickType(CartDto, [
  'uid',
  'pid',
  'quantity',
  // 'price',
  // 'amount',
] as const) {}
export class AddToCartDto extends PickType(CartDto, [
  'cid',
  'uid',
  'pid',
  'quantity',
  // 'price',
  // 'amount',
] as const) {}

// By now it's pretty the same but in the future qoing to enhance
export class RemoveItemDto extends PickType(CartDto, [
  'cid',
  'pid',
  'quantity',
] as const) {}
