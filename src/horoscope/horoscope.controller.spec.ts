import { Test, TestingModule } from '@nestjs/testing';
import { HoroscopeController } from './horoscope.controller';

describe('HoroscopeController', () => {
  let controller: HoroscopeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoroscopeController],
    }).compile();

    controller = module.get<HoroscopeController>(HoroscopeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
