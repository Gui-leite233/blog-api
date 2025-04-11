import { IsNotEmpty, IsString, IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  bookId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}