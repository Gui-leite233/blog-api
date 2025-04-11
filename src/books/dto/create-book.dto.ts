import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  publishedDate?: Date;
  
  @IsOptional()
  @IsArray()
  categories?: string[];
}