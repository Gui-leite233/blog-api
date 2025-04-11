import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray, IsMongoId } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
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