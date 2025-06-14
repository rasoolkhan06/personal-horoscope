import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service.js';

type JwtPayload = {
  sub: string;
  email: string;
  zodiacSign: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      return null;
    }
    
    // Return the user object that will be attached to the request
    return { 
      _id: user._id,
      userId: payload.sub, 
      email: payload.email,
      name: (user as any).name,
      zodiacSign: payload.zodiacSign 
    };
  }
}
