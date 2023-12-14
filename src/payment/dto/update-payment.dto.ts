import { IsOptional } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  details: string;
}
