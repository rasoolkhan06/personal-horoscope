import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports:[
        MongooseModule.forRoot('mongodb://localhost/personal-horoscope'),
    ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
