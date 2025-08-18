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

// TODO Some intresting hack with declare.
export class ProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product.',
  })
  pid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'some-uuid-string',
    description: 'The unique uuid of the product.',
  })
  uuid: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({
    example: 'Super Widget',
    description: 'The title of the product.',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({
    example: 'SW-001',
    description: 'The Stock Keeping Unit (SKU).',
  })
  sku: string;

  @ApiProperty({
    type: 'number',
    format: 'decimal',
    example: 99.99,
    description: 'The price of the product.',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with up to 2 decimal places.' },
  )
  @IsPositive()
  @Type(() => Number)
  // Ensures transformation from string if needed (e.g., from query params or form-data)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @ApiProperty({
    example: 'A very useful product. the best one',
    description: 'The product description.',
    nullable: true,
  })
  description: string | null;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'The true or false status of the product.',
  })
  @Type(() => Boolean)
  status?: boolean = true;

  @IsInt()
  @Min(0)
  @IsOptional({ message: 'It si default to 1 on create' })
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

export class CreateProductDto extends OmitType(ProductDto, [
  'pid',
  'uuid',
  'createdAt',
  'updatedAt',
] as const) {}
export class UpdateProductDto extends OmitType(ProductDto, [
  'pid',
  'uuid',
  'createdAt',
  'updatedAt',
] as const) {}
