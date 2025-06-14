import { IsString, IsEmail, MinLength, IsNotEmpty, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  birthdate: Date;
}