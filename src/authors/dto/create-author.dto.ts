import { IsNotEmpty, IsString, IsOptional, IsDate, IsUrl } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}