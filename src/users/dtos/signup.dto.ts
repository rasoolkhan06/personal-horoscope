import { IsString, IsEmail, IsDateString, MinLength, IsNotEmpty, IsDate } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: string;
}