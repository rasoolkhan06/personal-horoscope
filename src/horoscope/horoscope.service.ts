import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Horoscope, IHoroscope } from './horoscope.schema.js';
import { ZodiacSign } from '../common/enums/zodiac-sign.enum.js';
import type { CreateHoroscopeDto } from './dto/create-horoscope.dto.js';

type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
};

type HoroscopeContent = {
  content: string;
  mood: string;
  compatibility: number;
  luckyNumber: string;
  luckyTime: string;
  luckyColor: string;
};

// Mock data - In a real app, this would come from an external API or database
const HOROSCOPE_CONTENT: Record<ZodiacSign, HoroscopeContent> = {
  [ZodiacSign.Aries]: {
    content: 'A day full of energy and new beginnings. Take the initiative!',
    mood: 'Energetic',
    compatibility: 8,
    luckyNumber: '7',
    luckyTime: 'Morning',
    luckyColor: 'Red',
  },
  [ZodiacSign.Taurus]: {
    content: 'A stable day for you. Focus on your financial goals.',
    mood: 'Stable',
    compatibility: 7,
    luckyNumber: '4',
    luckyTime: 'Afternoon',
    luckyColor: 'Green',
  },
  [ZodiacSign.Gemini]: {
    content: 'Communication is key today. Reach out to friends and colleagues.',
    mood: 'Talkative',
    compatibility: 9,
    luckyNumber: '5',
    luckyTime: 'Evening',
    luckyColor: 'Yellow',
  },
  [ZodiacSign.Cancer]: {
    content: 'A good day to focus on home and family matters.',
    mood: 'Nurturing',
    compatibility: 6,
    luckyNumber: '2',
    luckyTime: 'Night',
    luckyColor: 'Silver',
  },
  [ZodiacSign.Leo]: {
    content: 'Your charisma is at its peak. Lead the way!',
    mood: 'Confident',
    compatibility: 9,
    luckyNumber: '1',
    luckyTime: 'Noon',
    luckyColor: 'Gold',
  },
  [ZodiacSign.Virgo]: {
    content: 'Focus on organization and details today.',
    mood: 'Analytical',
    compatibility: 7,
    luckyNumber: '6',
    luckyTime: 'Morning',
    luckyColor: 'Brown',
  },
  [ZodiacSign.Libra]: {
    content: 'A great day for relationships and finding balance.',
    mood: 'Diplomatic',
    compatibility: 8,
    luckyNumber: '9',
    luckyTime: 'Afternoon',
    luckyColor: 'Pink',
  },
  [ZodiacSign.Scorpio]: {
    content: 'Your intuition is strong. Trust your instincts.',
    mood: 'Intense',
    compatibility: 8,
    luckyNumber: '8',
    luckyTime: 'Evening',
    luckyColor: 'Maroon',
  },
  [ZodiacSign.Sagittarius]: {
    content: 'Adventure calls! Be open to new experiences.',
    mood: 'Adventurous',
    compatibility: 9,
    luckyNumber: '3',
    luckyTime: 'Morning',
    luckyColor: 'Purple',
  },
  [ZodiacSign.Capricorn]: {
    content: 'Focus on your long-term goals. Your hard work will pay off.',
    mood: 'Ambitious',
    compatibility: 7,
    luckyNumber: '10',
    luckyTime: 'Afternoon',
    luckyColor: 'Black',
  },
  [ZodiacSign.Aquarius]: {
    content: 'Innovative ideas are flowing. Share them with others.',
    mood: 'Innovative',
    compatibility: 7,
    luckyNumber: '11',
    luckyTime: 'Evening',
    luckyColor: 'Blue',
  },
  [ZodiacSign.Pisces]: {
    content: 'A dreamy day. Trust your intuition and creativity.',
    mood: 'Dreamy',
    compatibility: 8,
    luckyNumber: '12',
    luckyTime: 'Night',
    luckyColor: 'Sea Green',
  },
} as const;

@Injectable()
export class HoroscopeService {
  constructor(
    @InjectModel(Horoscope.name) private horoscopeModel: Model<IHoroscope>,
  ) {}

  private getTodaysDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private async findOrCreateHoroscope(
    userId: Types.ObjectId,
    zodiacSign: ZodiacSign,
    date: Date = this.getTodaysDate(),
  ): Promise<IHoroscope> {
    try {
      const existingHoroscope = await this.horoscopeModel.findOne({
        userId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      });

      if (existingHoroscope) {
        return existingHoroscope;
      }

      // In a real app, you would fetch this from an external API
      const content = HOROSCOPE_CONTENT[zodiacSign] || {
        content: 'Your daily horoscope is being prepared.',
        mood: 'Neutral',
        compatibility: 5,
        luckyNumber: Math.floor(Math.random() * 10).toString(),
        luckyTime: 'Afternoon',
        luckyColor: 'Blue',
      };

      return await this.horoscopeModel.create({
        userId,
        date,
        zodiacSign,
        ...content,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create or find horoscope');
    }
  }

  async getDailyHoroscope(
    userId: Types.ObjectId,
    zodiacSign: ZodiacSign,
    date?: Date,
  ): Promise<IHoroscope> {
    try {
      const targetDate = date || this.getTodaysDate();
      return await this.findOrCreateHoroscope(userId, zodiacSign, targetDate);
    } catch (error) {
      throw new BadRequestException('Failed to get daily horoscope');
    }
  }

  async getHoroscopeHistory(
    userId: string,
  ): Promise<{ data: IHoroscope[]; total: number }> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setHours(0, 0, 0, 0); // Set to start of day
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
      const query = {
        userId: userId,
        date: { $gte: sevenDaysAgo }
      };

      const [data, total] = await Promise.all([
        this.horoscopeModel
          .find(query)
          .sort({ date: -1 })
          .exec(),
        this.horoscopeModel.countDocuments(query),
      ]);
      
      return { data, total };
    } catch (error) {
      throw new BadRequestException('Failed to fetch horoscope history');
    }
  }
}
