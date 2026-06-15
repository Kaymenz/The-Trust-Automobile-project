import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Listing') private listingModel: Model<any>,
    @InjectModel('Booking') private bookingModel: Model<any>,
    @InjectModel('PartsOrder') private partsOrderModel: Model<any>,
    @InjectModel('Mechanic') private mechanicModel: Model<any>,
  ) {}

  async getStatsForRole(userId: string, role: string) {
    switch (role) {
      case UserRole.SELLER:
        return this.getSellerStats(userId);
      case UserRole.BUYER:
        return this.getBuyerStats(userId);
      case UserRole.RENTER:
        return this.getRenterStats(userId);
      case UserRole.MECHANIC:
        return this.getMechanicStats(userId);
      case UserRole.PARTS_DEALER:
        return this.getPartsStats(userId);
      case UserRole.ADMIN:
        return this.getAdminStats();
      default:
        return {};
    }
  }

  private async getSellerStats(userId: string) {
    const sellerRef = new Types.ObjectId(userId);

    const [totalListings, activeListings, soldItems, viewsAgg] = await Promise.all([
      this.listingModel.countDocuments({ seller: sellerRef }),
      this.listingModel.countDocuments({ seller: sellerRef, status: 'active' }),
      this.listingModel.countDocuments({ seller: sellerRef, status: 'sold' }),
      this.listingModel.aggregate([
        { $match: { seller: sellerRef } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
    ]);

    return {
      totalListings,
      activeListings,
      soldItems,
      totalViews: viewsAgg[0]?.totalViews || 0,
    };
  }

  private async getBuyerStats(userId: string) {
    const [user, totalBookings, activeBookings, completedBookings] = await Promise.all([
      this.userModel.findById(userId).select('savedCars').lean(),
      this.bookingModel.countDocuments({ userId }),
      this.bookingModel.countDocuments({ userId, status: { $in: ['pending', 'confirmed'] } }),
      this.bookingModel.countDocuments({ userId, status: 'completed' }),
    ]);

    return {
      savedCars: (user?.savedCars || []).length,
      totalBookings,
      activeBookings,
      completedBookings,
    };
  }

  private async getRenterStats(userId: string) {
    const [totalRentals, activeRentals, completedRentals] = await Promise.all([
      this.bookingModel.countDocuments({ userId, type: 'rental' }),
      this.bookingModel.countDocuments({ userId, type: 'rental', status: { $in: ['pending', 'confirmed'] } }),
      this.bookingModel.countDocuments({ userId, type: 'rental', status: 'completed' }),
    ]);

    return { totalRentals, activeRentals, completedRentals };
  }

  private async getMechanicStats(userId: string) {
    const mechanic = await this.mechanicModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    if (!mechanic) {
      return { totalServices: 0, completedServices: 0, rating: 0 };
    }

    const [totalServices, completedServices] = await Promise.all([
      this.bookingModel.countDocuments({ mechanicId: mechanic._id }),
      this.bookingModel.countDocuments({ mechanicId: mechanic._id, status: 'completed' }),
    ]);

    return { totalServices, completedServices, rating: mechanic.rating || 0 };
  }

  private async getPartsStats(userId: string) {
    const dealerRef = new Types.ObjectId(userId);

    const [totalOrders, pendingOrders] = await Promise.all([
      this.partsOrderModel.countDocuments({ dealerId: dealerRef }),
      this.partsOrderModel.countDocuments({ dealerId: dealerRef, status: 'Pending' }),
    ]);

    return { totalOrders, pendingOrders, totalItems: totalOrders };
  }

  private async getAdminStats() {
    const [totalUsers, totalListings, totalBookings] = await Promise.all([
      this.userModel.countDocuments(),
      this.listingModel.countDocuments(),
      this.bookingModel.countDocuments(),
    ]);

    return { totalUsers, totalListings, totalBookings };
  }

  async getRecentActivity(userId: string, role: string) {
    switch (role) {
      case UserRole.SELLER:
        return this.getSellerActivity(userId);
      case UserRole.BUYER:
        return this.getBuyerActivity(userId);
      case UserRole.RENTER:
        return this.getRenterActivity(userId);
      default:
        return [];
    }
  }

  private async getSellerActivity(userId: string) {
    const recentListings = await this.listingModel
      .find({ seller: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentListings.map(l => ({
      type: 'listing',
      action: 'Created listing',
      title: [l.make, l.model, l.year].filter(Boolean).join(' '),
      date: l.createdAt,
    }));
  }

  private async getBuyerActivity(userId: string) {
    const recentBookings = await this.bookingModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentBookings.map(b => ({
      type: 'booking',
      action: 'Made booking',
      title: b.vehicleDetails || 'Booking',
      date: b.createdAt,
    }));
  }

  private async getRenterActivity(userId: string) {
    const recentRentals = await this.bookingModel
      .find({ userId, type: 'rental' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentRentals.map(r => ({
      type: 'rental',
      action: 'Rented car',
      title: r.vehicleDetails || 'Rental',
      date: r.createdAt,
    }));
  }
}
