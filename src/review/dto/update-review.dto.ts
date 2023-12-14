import { IsOptional } from 'class-validator';
export class UpdateReviewDto {
  @IsOptional()
  review: string;

  @IsOptional()
  rating: number;
}
