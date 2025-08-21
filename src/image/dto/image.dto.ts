import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

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