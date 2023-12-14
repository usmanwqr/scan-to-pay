import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  review: string;

  @IsOptional()
  rating: number;

  @IsNotEmpty()
  merchantId: string;
}
