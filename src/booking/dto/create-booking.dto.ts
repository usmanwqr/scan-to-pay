import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  details: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  serviceId: string;
}
