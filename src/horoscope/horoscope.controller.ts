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
import { CreateHoroscopeDto, UpdateHoroscopeDto } from './dto/create-horoscope.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('horoscope')
@Controller('horoscope')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class HoroscopeController {
  constructor(private readonly horoscopeService: HoroscopeService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily horoscope for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns the daily horoscope' })
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
  @ApiOperation({ summary: 'Get horoscope history for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns paginated horoscope history' })
  async getHoroscopeHistory(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.horoscopeService.getHoroscopeHistory(
      req.user.userId,
      Number(limit),
      Number(page),
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new horoscope' })
  @ApiResponse({ status: 201, description: 'Horoscope created successfully' })
  async createHoroscope(
    @Request() req: any,
    @Body() createHoroscopeDto: CreateHoroscopeDto,
  ) {
    return this.horoscopeService.getDailyHoroscope(
      req.user.userId,
      createHoroscopeDto.zodiacSign,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a horoscope' })
  @ApiResponse({ status: 200, description: 'Horoscope updated successfully' })
  async updateHoroscope(
    @Param('id') id: string,
    @Body() updateHoroscopeDto: UpdateHoroscopeDto,
  ) {
    return this.horoscopeService.updateHoroscope(id, updateHoroscopeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a horoscope' })
  @ApiResponse({ status: 204, description: 'Horoscope deleted successfully' })
  async deleteHoroscope(@Param('id') id: string) {
    return this.horoscopeService.deleteHoroscope(id);
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
