import { ZodiacSign } from '../enums/zodiac-sign.enum';

export function getZodiacSign(birthdate: Date): string {
  const day = birthdate.getUTCDate();
  const month = birthdate.getUTCMonth() + 1; // getUTCMonth() returns 0-11

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return ZodiacSign.Aries;
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return ZodiacSign.Taurus;
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return ZodiacSign.Gemini;
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return ZodiacSign.Cancer;
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return ZodiacSign.Leo;
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return ZodiacSign.Virgo;
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return ZodiacSign.Libra;
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return ZodiacSign.Scorpio;
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return ZodiacSign.Sagittarius;
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return ZodiacSign.Capricorn;
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return ZodiacSign.Aquarius;
  } else {
    return ZodiacSign.Pisces;
  }
}
