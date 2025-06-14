import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { HoroscopeService } from './horoscope.service.js';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard.js';
import { ZodiacSign } from '../common/enums/zodiac-sign.enum.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@ApiTags('horoscope')
@Controller('horoscope')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) {}

  @Get('today')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Get daily horoscope for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns todays horoscope' })
  async getDailyHoroscope(
    @Request() req: any,
    @Query('date') date?: string,
  ) {
    try {
      const parsedDate = date ? new Date(date) : undefined;
      if (parsedDate && isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }
      
      return this.horoscopeService.getDailyHoroscope(
        req.user.userId,
        req.user.zodiacSign,
        parsedDate,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('history')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Get last 7 days of horoscopes for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns last 7 days of horoscopes' })
  async getHoroscopeHistory(
    @Request() req: any,
  ) {
    const result = await this.horoscopeService.getHoroscopeHistory(req.user.userId);
    return result.data;
  }

  @Get('zodiac-signs')
  @ApiOperation({ summary: 'Get all available zodiac signs' })
  @ApiResponse({ status: 200, description: 'Returns all zodiac signs' })
  getZodiacSigns() {
    return Object.entries(ZodiacSign).map(([key, value]) => ({
      key,
      value,
    }));
  }
}
