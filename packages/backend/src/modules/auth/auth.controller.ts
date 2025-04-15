import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get,
  Req,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirects to Google OAuth',
  })
  googleAuth() {
    // This endpoint redirects to Google for authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ 
    status: 302, 
    description: 'Redirects to frontend with token',
  })
  googleAuthCallback(@Req() req, @Res() res) {
    const frontendUrl = this.configService.get('frontend.url');
    
    this.authService.googleLogin(req.user).then(data => {
      const redirectUrl = `${frontendUrl}/auth/callback?token=${data.accessToken}`;
      res.redirect(redirectUrl);
    });
  }
} 