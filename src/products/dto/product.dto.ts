import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// TODO Some intresting hack with declare.
export class CreateProductDto {
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
    example: 'A very useful widget.',
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
  status?: boolean = true;
}

export class UpdateProductDto extends CreateProductDto {}

export class ProductDto extends CreateProductDto {
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
