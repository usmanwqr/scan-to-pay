import { IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  name: string;

  @IsOptional()
  number: string;

  @IsOptional()
  cvv: number;

  @IsOptional()
  expiryDate: string;
}
