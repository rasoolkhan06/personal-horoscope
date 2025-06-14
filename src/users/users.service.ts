import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, IUser } from './users.schema.js';
import { SignupDto } from './dtos/signup.dto.js';
import { getZodiacSign } from '../common/utils/zodiac.utils.js';

export interface IUserService {
  create(createUserDto: SignupDto): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
  ) {}

  async create(createUserDto: SignupDto): Promise<IUser> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Calculate zodiac sign from the birthdate
    const zodiacSign = getZodiacSign(createUserDto.birthdate);

    // Create new user with all required fields
    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      birthdate: createUserDto.birthdate,
      zodiacSign,
    });

    return newUser.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
