import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';
import { ZodiacSign } from '../../common/enums/zodiac-sign.enum.js';

export class CreateHoroscopeDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  compatibility?: number;

  @IsString()
  @IsOptional()
  luckyNumber?: string;

  @IsString()
  @IsOptional()
  luckyTime?: string;

  @IsString()
  @IsOptional()
  luckyColor?: string;

  @IsEnum(ZodiacSign)
  zodiacSign: ZodiacSign;
}

export class UpdateHoroscopeDto extends (CreateHoroscopeDto as any) {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(ZodiacSign)
  @IsOptional()
  zodiacSign?: ZodiacSign;
}
