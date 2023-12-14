import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  name: string;

  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  cvv: number;

  @IsNotEmpty()
  expiryDate: string;
}
