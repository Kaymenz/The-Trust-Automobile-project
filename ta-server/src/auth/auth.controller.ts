import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto, VerifyOtpDto, VerifyEmailResponseDto } from './dto/otp.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LoginResponseDto, UserResponseDto, ApiErrorResponse } from '../common/dto/api-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Authenticate user with email and password. Returns JWT token and user info.' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials', type: ApiErrorResponse })
  @ApiResponse({ status: 403, description: 'Account blocked or suspended', type: ApiErrorResponse })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration', description: 'Register a new user account. OTP will be sent to email for verification.' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: LoginResponseDto })
  @ApiResponse({ status: 409, description: 'Email already registered', type: ApiErrorResponse })
  @ApiResponse({ status: 400, description: 'Validation error', type: ApiErrorResponse })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email', description: 'Send OTP verification code to the provided email address.' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email or OTP already sent', type: ApiErrorResponse })
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP', description: 'Verify the OTP code sent to email. Returns JWT token on success.' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', type: VerifyEmailResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP', type: ApiErrorResponse })
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email', description: 'Request a new OTP code to be sent to the email address.' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid email', type: ApiErrorResponse })
  resendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.resendOtp(sendOtpDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the authenticated user\'s profile information.' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ApiErrorResponse })
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId);
  }
}
