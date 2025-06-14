import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
