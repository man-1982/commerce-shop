import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

export class CartItemDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the cart item.',
  })
  ci_id: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: 'fd3e4f36-b9b6-4937-959f-ead5ba6ed4b2',
    description: 'The unique uuid of the cart.',
  })
  uuid: string;

  @IsInt()
  @Min(0)
  @IsOptional({ message: 'It is  default to 1 on create' })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The creation date of the product.',
  })
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The last update date of the product.',
  })
  updatedAt: Date;
}

export class CreateCartItemDto extends OmitType(CartItemDto, [
  'ci_id',
  'uuid',
  'createdAt',
  'updatedAt',
] as const) {}

export class UpdateCartItemDto extends PartialType(CartItemDto) {}
