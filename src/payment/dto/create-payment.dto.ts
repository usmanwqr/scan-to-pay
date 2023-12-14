import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { MethodType } from './method-type.enum';

export class CreatePaymentDto {
  @IsOptional()
  details: string;

  @IsNotEmpty()
  bookingId: string;

  @IsNotEmpty()
  @IsEnum(MethodType)
  methodType: MethodType;

  @IsNotEmpty()
  @IsOptional()
  cardId: string;
}
