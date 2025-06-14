import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module.js';
import { HoroscopeController } from './horoscope.controller.js';
import { HoroscopeService } from './horoscope.service.js';
import { Horoscope, HoroscopeSchema } from './horoscope.schema.js';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Horoscope.name, schema: HoroscopeSchema },
    ]),
  ],
  controllers: [HoroscopeController],
  providers: [HoroscopeService],
  exports: [HoroscopeService],
})
export class HoroscopeModule {}
