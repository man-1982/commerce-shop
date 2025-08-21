import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

/**
 * DTO => create.
 */
export class ImageDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the image.',
  })
  mid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==',
    description: 'The base64 encoded image data.',
  })
  imageData: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'A beautiful landscape',
    description: 'An optional title for the image.',
    required: false,
  })
  title?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product this image belongs to.',
  })
  pid: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The creation date of the image.',
  })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The last update date of the image.',
  })
  updatedAt: Date;
}

/**
 * DTO create.
 */
export class CreateImageDto extends PickType(ImageDto, [
  'imageData',
  'title',
  'pid',
] as const) {}

/**
 * DTO update.
 * All fields are optional.
 */
export class UpdateImageDto extends PartialType(
  PickType(ImageDto, ['imageData', 'title'] as const),
) {}
