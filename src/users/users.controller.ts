import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpCode,
  UsePipes,
  ValidationPipe 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.usersService.create(signupDto);
    return {
      status: 'success',
      data: user,
    };
  }
}
