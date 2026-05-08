import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry } from './schemas/inquiry.schema';

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<Inquiry>,
  ) {}

  async getInquiriesBySeller(sellerId: string): Promise<Inquiry[]> {
    try {
      this.logger.debug(`Fetching inquiries for seller: ${sellerId}`);

      // Fetch inquiries for all listings of this seller
      const inquiries = await this.inquiryModel
        .find()
        .populate({
          path: 'listingId',
          populate: {
            path: 'seller',
          },
        })
        .sort({ createdAt: -1 })
        .exec();

      // Filter to only inquiries for this seller's listings
      const sellerInquiries = inquiries.filter((inquiry) => {
        const listing = inquiry.listingId as any;
        return (
          listing &&
          listing.seller &&
          listing.seller._id?.toString() === sellerId
        );
      });

      this.logger.debug(
        `Found ${sellerInquiries.length} inquiries for seller ${sellerId}`
      );
      return sellerInquiries;
    } catch (error) {
      this.logger.error(
        `Error fetching inquiries for seller ${sellerId}:`,
        error
      );
      throw error;
    }
  }

  async getAnalyticsBySeller(sellerId: string): Promise<any> {
    try {
      this.logger.debug(`Calculating analytics for seller: ${sellerId}`);

      // Get all inquiries for seller's listings
      const allInquiries = await this.inquiryModel
        .find()
        .populate({
          path: 'listingId',
          populate: {
            path: 'seller',
          },
        })
        .exec();

      const sellerInquiries = allInquiries.filter((inquiry) => {
        const listing = inquiry.listingId as any;
        return (
          listing &&
          listing.seller &&
          listing.seller._id?.toString() === sellerId
        );
      });

      // Calculate this month dates
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calculate metrics
      const totalInquiries = sellerInquiries.length;
      const inquiriesThisMonth = sellerInquiries.filter(
        (inquiry) => new Date(inquiry.createdAt) >= firstDayOfMonth
      ).length;

      const pendingInquiries = sellerInquiries.filter(
        (inquiry) => inquiry.status === 'Pending'
      ).length;

      // Count inquiries by make
      const listingsByMake: Record<string, number> = {};
      sellerInquiries.forEach((inquiry) => {
        const listing = inquiry.listingId as any;
        if (listing && listing.make) {
          listingsByMake[listing.make] =
            (listingsByMake[listing.make] || 0) + 1;
        }
      });

      // Get recent inquiry dates
      const recentInquiryDates = sellerInquiries
        .slice(0, 10)
        .map((inquiry) => inquiry.createdAt);

      // Calculate counts based on inquiries
      const uniqueListingsSold = new Set(
        sellerInquiries
          .filter((inquiry) => inquiry.status === 'Closed')
          .map((inquiry) => {
            const listing = inquiry.listingId as any;
            return listing?._id?.toString();
          })
      ).size;

      const listingsSoldThisMonth = sellerInquiries.filter(
        (inquiry) =>
          inquiry.status === 'Closed' &&
          new Date(inquiry.createdAt) >= firstDayOfMonth
      ).length;

      // Estimate revenue (mock: 100000 GHS per inquiry closed, scaled by month)
      const totalRevenue = uniqueListingsSold * 100000;
      const revenueThisMonth = listingsSoldThisMonth * 100000;

      // Total listings = total unique inquiries
      const totalListings = new Set(
        sellerInquiries.map((inquiry) => {
          const listing = inquiry.listingId as any;
          return listing?._id?.toString();
        })
      ).size;

      const analytics = {
        totalListings,
        listingsSoldThisMonth,
        totalInquiries,
        inquiriesThisMonth,
        pendingInquiries,
        totalRevenue,
        revenueThisMonth,
        listingsByMake,
        recentInquiryDates,
      };

      this.logger.debug(`Analytics calculated for seller ${sellerId}:`, analytics);
      return analytics;
    } catch (error) {
      this.logger.error(
        `Error calculating analytics for seller ${sellerId}:`,
        error
      );
      throw error;
    }
  }
}
