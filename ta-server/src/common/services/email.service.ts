import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string, name?: string): Promise<boolean> {
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8A828;">Email Verification - Trust Automobile</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Your email verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #0B1D35;">${otp}</h1>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© 2026 Trust Automobile Ghana. All rights reserved.</p>
        </div>
      `;

      const mailOptions = {
        from: `"Trust Automobile" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Email Verification - Trust Automobile',
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new BadRequestException('Failed to send verification email. Please try again later.');
    }
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8A828;">Welcome to Trust Automobile!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Your email has been verified successfully. You can now access all features of Trust Automobile.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
               style="background: #E8A828; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">© 2026 Trust Automobile Ghana. All rights reserved.</p>
        </div>
      `;

      const mailOptions = {
        from: `"Trust Automobile" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Welcome to Trust Automobile',
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  getOtpExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes expiry
    return expiry;
  }

  isOtpExpired(expiryTime: Date): boolean {
    return new Date() > expiryTime;
  }

  isOtpThrottled(lastRequestTime: Date | undefined): boolean {
    if (!lastRequestTime) return false;
    const timeDiffSeconds = (new Date().getTime() - new Date(lastRequestTime).getTime()) / 1000;
    return timeDiffSeconds < 60; // 1 minute throttle between OTP requests
  }
}
