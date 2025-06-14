import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module.js';
import { HoroscopeModule } from './horoscope/horoscope.module.js';

@Module({
  imports: [
    UsersModule,
    HoroscopeModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
  controllers: [],
})
export class AppModule {}
