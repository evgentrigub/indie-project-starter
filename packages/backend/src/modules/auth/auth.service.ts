import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { User, AuthProvider } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    return this.generateTokenResponse(user);
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    return this.generateTokenResponse(user);
  }

  /* Google auth methods commented out for initial setup
  async validateOAuthUser(email: string, provider: AuthProvider): Promise<User> {
    let user = await this.usersService.findByEmail(email);
    
    if (!user) {
      // Create new user if not exists
      user = await this.usersService.create({
        email,
        provider,
        // For OAuth users, we don't need a password
        password: Math.random().toString(36).slice(-8),
      });
    }
    
    return user;
  }
  
  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }
    
    const dbUser = await this.validateOAuthUser(
      user.email,
      AuthProvider.GOOGLE,
    );
    
    return this.generateTokenResponse(dbUser);
  }
  */

  private generateTokenResponse(user: User) {
    const payload = { email: user.email, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        hasActiveSubscription: user.hasActiveSubscription,
      },
    };
  }
} 