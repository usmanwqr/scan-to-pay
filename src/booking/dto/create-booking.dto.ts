import { IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  details: string;

  userId: string;

  serviceId: string;
}
