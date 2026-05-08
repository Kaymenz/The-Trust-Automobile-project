import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ListingsService } from './listings/listings.service';
import { UserRole, UserStatus } from './users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const listingsService = app.get(ListingsService);

  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminExists = await usersService.findByEmail('admin@trustautomobile.com');
  if (!adminExists) {
    await usersService.create({
      name: 'Admin User',
      email: 'admin@trustautomobile.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    console.log('✅ Admin user created');
  }

  // Create sample seller
  const sellerExists = await usersService.findByEmail('seller@example.com');
  let sellerId: string;
  if (!sellerExists) {
    const seller = await usersService.create({
      name: 'Kwame Asante',
      email: 'seller@example.com',
      password: 'password123',
      role: UserRole.SELLER,
      status: UserStatus.ACTIVE,
      phone: '+233241234567',
      location: 'Accra',
      profile: {
        businessName: 'Asante Auto Sales',
        description: 'Trusted car dealer in Accra',
        address: '123 Main Street',
        city: 'Accra',
        region: 'Greater Accra',
        verified: true,
      },
    });
    sellerId = seller._id.toString();
    console.log('✅ Seller user created');
  } else {
    sellerId = sellerExists._id.toString();
  }

  // Create sample listings
  const sampleListings = [
    {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 85000,
      mileage: 45000,
      transmission: 'automatic',
      fuelType: 'petrol',
      color: 'Silver',
      location: 'Accra',
      description: 'Well maintained Toyota Camry with full service history',
      features: ['Air Conditioning', 'Power Windows', 'Alloy Wheels', 'Bluetooth'],
    },
    {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      price: 65000,
      mileage: 32000,
      transmission: 'automatic',
      fuelType: 'petrol',
      color: 'Black',
      location: 'Kumasi',
      description: 'Clean Honda Civic in excellent condition',
      features: ['Sunroof', 'Leather Seats', 'Backup Camera'],
    },
    {
      make: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2021,
      price: 150000,
      mileage: 15000,
      transmission: 'automatic',
      fuelType: 'petrol',
      color: 'White',
      location: 'Accra',
      description: 'Luxury Mercedes C-Class with premium features',
      features: ['Leather Seats', 'Navigation', 'Panoramic Roof', 'LED Headlights'],
      isFeatured: true,
      featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const listingData of sampleListings) {
    try {
      await listingsService.create(sellerId, listingData);
      console.log(`✅ Created listing: ${listingData.make} ${listingData.model}`);
    } catch (error) {
      console.log(`⚠️ Listing may already exist: ${listingData.make} ${listingData.model}`);
    }
  }

  console.log('✅ Database seed completed!');
  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
