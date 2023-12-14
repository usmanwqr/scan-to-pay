import { IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  name: string;

  number: string;

  cvv: number;

  expiryDate: string;
}
