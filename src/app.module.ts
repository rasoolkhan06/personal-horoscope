import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
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
})
export class AppModule {}
