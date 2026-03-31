import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
