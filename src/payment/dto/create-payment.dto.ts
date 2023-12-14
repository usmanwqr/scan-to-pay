import { IsEnum, IsOptional } from 'class-validator';
import { MethodType } from './method-type.enum';

export class CreatePaymentDto {
  @IsOptional()
  details: string;

  bookingId: string;

  @IsEnum(MethodType)
  methodType: MethodType;

  @IsOptional()
  cardId: string;
}
