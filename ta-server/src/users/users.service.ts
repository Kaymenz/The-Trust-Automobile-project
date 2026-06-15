import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { Listing } from '../listings/schemas/listing.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const normalizedEmail = createUserDto.email?.trim().toLowerCase();
    const existingUser = await this.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      email: normalizedEmail,
      password: hashedPassword,
      status: UserStatus.PENDING,
      emailVerified: false,
    });

    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) return null;
    return this.userModel.findOne({ email: normalizedEmail }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { lastLoginAt: new Date() }).exec();
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateOtp(id: string, otp: string, otpExpiry: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      otpCode: otp,
      otpExpiry: otpExpiry,
      otpAttempts: 0,
      lastOtpRequestAt: new Date(),
    }).exec();
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { $inc: { otpAttempts: 1 } }).exec();
  }

  async verifyEmail(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      emailVerified: true,
      status: UserStatus.ACTIVE,
      otpCode: null,
      otpExpiry: null,
      otpAttempts: 0,
    }).exec();
  }

  async getSavedCars(userId: string): Promise<Listing[]> {
    const user = await this.userModel.findById(userId).select('savedCars').lean();
    if (!user) throw new NotFoundException('User not found');
    if (!user.savedCars || user.savedCars.length === 0) return [];
    return this.listingModel
      .find({ _id: { $in: user.savedCars }, status: 'active' })
      .populate('seller', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async saveCar(userId: string, listingId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { savedCars: listingId },
    }).exec();
  }

  async unsaveCar(userId: string, listingId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { savedCars: listingId },
    }).exec();
  }

  async getStats(): Promise<any> {
    const total = await this.userModel.countDocuments();
    const active = await this.userModel.countDocuments({ status: UserStatus.ACTIVE });
    const pending = await this.userModel.countDocuments({ status: UserStatus.PENDING });
    const blocked = await this.userModel.countDocuments({ status: UserStatus.BLOCKED });

    return { total, active, pending, blocked };
  }
}
