import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { SignupDto } from './dtos/signup.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('auth')
@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.usersService.create(signupDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req: any) {    
    const payload = {
      sub: req.user._id,
      email: req.user.email,
      zodiacSign: req.user.zodiacSign,
    };

    return {
      status: 'success',
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          zodiacSign: req.user.zodiacSign,
        },
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return {
      status: 'success',
      data: req.user,
    };
  }
}
