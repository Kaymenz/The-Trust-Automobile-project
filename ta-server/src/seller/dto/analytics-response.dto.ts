import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({ example: 15, description: 'Total active listings' })
  totalListings: number;

  @ApiProperty({ example: 3, description: 'Listings sold this month' })
  listingsSoldThisMonth: number;

  @ApiProperty({ example: 45, description: 'Total inquiries received' })
  totalInquiries: number;

  @ApiProperty({ example: 12, description: 'Inquiries this month' })
  inquiriesThisMonth: number;

  @ApiProperty({ example: 8, description: 'Inquiries pending response' })
  pendingInquiries: number;

  @ApiProperty({ example: 125000, description: 'Total revenue from sales' })
  totalRevenue: number;

  @ApiProperty({ example: 45000, description: 'Revenue this month' })
  revenueThisMonth: number;

  @ApiProperty({
    example: {
      'Toyota': 5,
      'Honda': 3,
      'Mercedes': 2,
    },
    description: 'Listings by vehicle make',
  })
  listingsByMake: Record<string, number>;

  @ApiProperty({
    example: ['2024-01-15', '2024-01-18', '2024-02-05'],
    description: 'Recent inquiry dates',
  })
  recentInquiryDates: Date[];
}
