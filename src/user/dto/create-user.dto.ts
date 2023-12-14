import { IsEmail, IsEnum, IsOptional, Length } from 'class-validator';
import { UserRole } from './user.enum';

export class CreateUserDto {
  name: string;

  @IsEmail()
  email: string;

  @Length(2, 8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
