import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/services/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { User, UserStatus } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('Account has been blocked');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account has been suspended');
    }

    // Only allow login if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email to continue.');
    }

    await this.usersService.updateLastLogin(user._id);

    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create(registerDto);
    
    // Send OTP for email verification
    await this.sendOtp({ email: registerDto.email });

    return {
      success: true,
      message: 'Registration successful. Please check your email for the verification code.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const user = await this.usersService.findByEmail(sendOtpDto.email);

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // Check if email is already verified
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check throttling (1 minute between requests)
    if (this.emailService.isOtpThrottled(user.lastOtpRequestAt)) {
      throw new BadRequestException('Please wait before requesting a new OTP');
    }

    const otp = this.emailService.generateOtp();
    const otpExpiry = this.emailService.getOtpExpiry();

    await this.usersService.updateOtp(user._id, otp, otpExpiry);
    await this.emailService.sendOtpEmail(sendOtpDto.email, otp, user.name);

    return {
      success: true,
      message: 'OTP sent to your email. It will expire in 10 minutes.',
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(verifyOtpDto.email);

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Check if OTP has expired
    if (!user.otpCode || !user.otpExpiry || this.emailService.isOtpExpired(user.otpExpiry)) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Check OTP attempts
    if ((user.otpAttempts || 0) >= 5) {
      throw new BadRequestException('Too many failed attempts. Please request a new OTP.');
    }

    // Verify OTP
    if (user.otpCode !== verifyOtpDto.otp) {
      await this.usersService.incrementOtpAttempts(user._id);
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    // Mark email as verified
    await this.usersService.verifyEmail(user._id);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(verifyOtpDto.email, user.name);

    // Generate JWT token
    const payload = { 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    };

    return {
      success: true,
      message: 'Email verified successfully',
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: UserStatus.ACTIVE,
      },
    };
  }

  async resendOtp(sendOtpDto: SendOtpDto) {
    return this.sendOtp(sendOtpDto);
  }

  async getProfile(userId: string) {
    return this.usersService.findById(userId);
  }
}

