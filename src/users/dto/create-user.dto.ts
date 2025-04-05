import { IsNotEmpty, IsString, IsOptional, IsArray, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}