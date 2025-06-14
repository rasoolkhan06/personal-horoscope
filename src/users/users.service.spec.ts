import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersService } from './users.service.js';
import { SignupDto } from './dtos/signup.dto.js';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;

  const mockUser = {
    _id: new Types.ObjectId(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    birthdate: new Date('1990-01-01'),
    zodiacSign: 'Capricorn',
  };

  const signupDto: SignupDto = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    birthdate: new Date('1990-01-01'),
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    
    // Mock bcrypt
    (bcrypt.genSalt as jest.Mock) = jest.fn().mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashedpassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.create(signupDto);

      expect(result).toEqual(mockUser);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 'salt');
      expect(mockUserModel.create).toHaveBeenCalledWith({
        name: signupDto.name,
        email: signupDto.email,
        password: 'hashedpassword',
        birthdate: signupDto.birthdate,
        zodiacSign: expect.any(String),
      });
    });

    it('should throw an error if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.create(signupDto))
        .rejects
        .toThrow(HttpException);
      
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: signupDto.email
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser)
      });

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      });

      const result = await service.findByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });
});
