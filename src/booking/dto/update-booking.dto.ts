import { IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @IsOptional()
  details: string;
}
