import { IsOptional } from 'class-validator';

export class CreateReviewDto {
  review: string;

  @IsOptional()
  rating: number;

  merchantId: string;
}
