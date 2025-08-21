import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

/**
 * DTO => create.
 */
export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  imageData: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  pid: number;
}

/**
 * DTO => update.
 */
export class UpdateImageDto {
  @IsString()
  @IsOptional()
  imageData?: string;

  @IsString()
  @IsOptional()
  title?: string;
}
