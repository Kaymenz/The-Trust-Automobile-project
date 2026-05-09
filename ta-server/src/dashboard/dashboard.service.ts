import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const totalListings = await this.listingModel.countDocuments({ userId });
    const activeListings = await this.listingModel.countDocuments({ userId, status: 'active' });
    const soldItems = await this.listingModel.countDocuments({ userId, status: 'sold' });
    
    const listings = await this.listingModel
      .find({ userId })
      .select('views impressions')
      .lean();
    
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    const totalImpressions = listings.reduce((sum, l) => sum + (l.impressions || 0), 0);

    return {
      totalListings,
      activeListings,
      soldItems,
      totalViews,
      totalImpressions,
      conversionRate: totalImpressions > 0 ? ((totalViews / totalImpressions) * 100).toFixed(2) : 0,
    };
  }

  private async getBuyerStats(userId: string) {
    const savedCars = await this.listingModel.countDocuments({ 'savedBy': userId });
    const totalBookings = await this.bookingModel.countDocuments({ buyerId: userId });
    const activeBookings = await this.bookingModel.countDocuments({ buyerId: userId, status: 'active' });
    const completedBookings = await this.bookingModel.countDocuments({ buyerId: userId, status: 'completed' });

    return {
      savedCars,
      totalBookings,
      activeBookings,
      completedBookings,
    };
  }

  private async getRenterStats(userId: string) {
    const totalRentals = await this.bookingModel.countDocuments({ renterId: userId });
    const activeRentals = await this.bookingModel.countDocuments({ renterId: userId, status: 'active' });
    const completedRentals = await this.bookingModel.countDocuments({ renterId: userId, status: 'completed' });

    return {
      totalRentals,
      activeRentals,
      completedRentals,
    };
  }

  private async getMechanicStats(userId: string) {
    const totalServices = await this.bookingModel.countDocuments({ mechanicId: userId });
    const completedServices = await this.bookingModel.countDocuments({ mechanicId: userId, status: 'completed' });

    return {
      totalServices,
      completedServices,
      rating: 4.5, // This should come from actual ratings
    };
  }

  private async getPartsStats(userId: string) {
    const totalOrders = await this.partsOrderModel.countDocuments({ supplierId: userId });
    const totalItems = await this.partsOrderModel.countDocuments({ supplierId: userId });

    return {
      totalOrders,
      totalItems,
    };
  }

  private async getAdminStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalListings = await this.listingModel.countDocuments();
    const totalBookings = await this.bookingModel.countDocuments();

    return {
      totalUsers,
      totalListings,
      totalBookings,
    };
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
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentListings.map(l => ({
      type: 'listing',
      action: 'Created listing',
      title: l.title,
      date: l.createdAt,
    }));
  }

  private async getBuyerActivity(userId: string) {
    const recentBookings = await this.bookingModel
      .find({ buyerId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentBookings.map(b => ({
      type: 'booking',
      action: 'Made booking',
      title: b.carTitle || 'Booking',
      date: b.createdAt,
    }));
  }

  private async getRenterActivity(userId: string) {
    const recentRentals = await this.bookingModel
      .find({ renterId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return recentRentals.map(r => ({
      type: 'rental',
      action: 'Rented car',
      title: r.carTitle || 'Rental',
      date: r.createdAt,
    }));
  }
}
