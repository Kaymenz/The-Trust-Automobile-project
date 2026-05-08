/**
 * Seed script to migrate hardcoded frontend data to MongoDB database
 * Run with: npm run seed:frontend
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ListingsService } from './listings/listings.service';
import { FleetService } from './fleet/fleet.service';
import { SparePartsService } from './spare-parts/spare-parts.service';
import { MechanicsService } from './mechanics/mechanics.service';
import { UserRole, UserStatus } from './users/schemas/user.schema';
import { ListingStatus } from './listings/schemas/listing.schema';
import { FleetCarStatus, CarCategory } from './fleet/schemas/fleet-car.schema';
import { PartStatus } from './spare-parts/schemas/spare-part.schema';
import { MechanicStatus } from './mechanics/schemas/mechanic.schema';
import * as bcrypt from 'bcrypt';

// Hardcoded data from frontend
const FRONTEND_CARS = [
  { id: 1, make: 'Toyota', model: 'Land Cruiser Prado', year: 2020, price: 320000, mileage: 42000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: 'Featured', desc: 'Excellent condition. Full service history. Leather seats, sunroof, reverse camera. No accidents.' },
  { id: 2, make: 'Honda', model: 'CR-V EX', year: 2023, price: 148000, mileage: 8200, fuel: 'Petrol', transmission: 'Automatic', location: 'Kumasi', condition: 'New', badge: 'New', desc: 'Brand new import. Factory warranty. Apple CarPlay, Android Auto. Available for test drive.' },
  { id: 3, make: 'Mercedes-Benz', model: 'C200 AMG', year: 2021, price: 320000, mileage: 31000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: 'Featured', desc: 'AMG Sport package. Panoramic roof. Heated seats. Full spec. Serious buyers only.' },
  { id: 4, make: 'Hyundai', model: 'Tucson GLS', year: 2019, price: 88000, mileage: 72000, fuel: 'Diesel', transmission: 'Manual', location: 'Takoradi', condition: 'Used', badge: '', desc: 'Family SUV in great shape. New tyres. Cold AC. Clean interior. No hidden faults.' },
  { id: 5, make: 'Toyota', model: 'Corolla LE', year: 2020, price: 65000, mileage: 45000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: 'Featured', desc: 'Single owner. Clean title. Just serviced. Fuel efficient city car. Available for viewing.' },
  { id: 6, make: 'BMW', model: 'X5 xDrive', year: 2022, price: 420000, mileage: 15000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: '', desc: 'Full options. HUD display. Harman Kardon audio. 360 camera. Serious enquiries only.' },
  { id: 7, make: 'Ford', model: 'Ranger Wildtrak', year: 2021, price: 175000, mileage: 38000, fuel: 'Diesel', transmission: 'Automatic', location: 'Kumasi', condition: 'Used', badge: '', desc: '4x4. Bi-turbo diesel. Hard tonneau cover. Spotless interior. Workhorse and weekend warrior.' },
  { id: 8, make: 'Kia', model: 'Sportage GT', year: 2022, price: 110000, mileage: 22000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: '', desc: 'GT-Line spec. Full panoramic roof. Heated and cooled seats. Low mileage, immaculate condition.' },
  { id: 9, make: 'Nissan', model: 'X-Trail', year: 2018, price: 72000, mileage: 91000, fuel: 'Petrol', transmission: 'CVT', location: 'Cape Coast', condition: 'Used', badge: '', desc: '7-seater. Family owned. All services done at dealership. New brake pads and battery.' },
  { id: 10, make: 'Volkswagen', model: 'Tiguan TSI', year: 2021, price: 195000, mileage: 28000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: '', desc: 'Imported from Germany. One owner. DSG gearbox. Full VW service history. Beautiful condition.' },
  { id: 11, make: 'Toyota', model: 'Hilux GD6', year: 2022, price: 220000, mileage: 19000, fuel: 'Diesel', transmission: 'Manual', location: 'Tamale', condition: 'Used', badge: '', desc: 'Double cab. Canopy included. Lightly used fleet vehicle. Excellent working condition.' },
  { id: 12, make: 'Honda', model: 'Accord Sport', year: 2020, price: 95000, mileage: 55000, fuel: 'Petrol', transmission: 'Automatic', location: 'Accra', condition: 'Used', badge: '', desc: 'Sport trim. Honda Sensing safety suite. Wireless CarPlay. Clean and well maintained.' },
];

const FRONTEND_FLEET = [
  { id: 1, type: 'economy', name: 'Toyota Yaris', subtitle: 'Economy · Hatchback', price: 180, seats: 5, fuel: 'Petrol', transmission: 'Auto', badge: 'available', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=70', location: 'Accra' },
  { id: 2, type: 'suv', name: 'Toyota RAV4', subtitle: 'SUV · 4WD', price: 450, seats: 5, fuel: 'Petrol', transmission: 'Auto', badge: 'available', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=70', location: 'Accra' },
  { id: 3, type: 'luxury', name: 'Mercedes E-Class', subtitle: 'Luxury · Sedan', price: 850, seats: 5, fuel: 'Petrol', transmission: 'Auto', badge: 'premium', img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=70', location: 'Accra' },
  { id: 4, type: 'electric', name: 'Tesla Model 3', subtitle: 'Electric · Sedan', price: 620, seats: 5, fuel: 'Electric', transmission: 'Auto', badge: 'electric', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=70', location: 'Accra' },
  { id: 5, type: 'suv', name: 'Ford Explorer', subtitle: 'SUV · 7-Seater', price: 520, seats: 7, fuel: 'Petrol', transmission: 'Auto', badge: 'available', img: 'https://images.unsplash.com/photo-1568844293986-ca9c5c525285?w=600&q=70', location: 'Kumasi' },
  { id: 6, type: 'compact', name: 'Honda Civic', subtitle: 'Compact · Sedan', price: 220, seats: 5, fuel: 'Petrol', transmission: 'Manual', badge: 'available', img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=70', location: 'Takoradi' },
  { id: 7, type: 'minivan', name: 'Toyota Hiace', subtitle: 'Minivan · 15-Seater', price: 380, seats: 15, fuel: 'Diesel', transmission: 'Manual', badge: 'available', img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=70', location: 'Accra' },
  { id: 8, type: 'luxury', name: 'BMW 5 Series', subtitle: 'Luxury · Sedan', price: 780, seats: 5, fuel: 'Petrol', transmission: 'Auto', badge: 'premium', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=70', location: 'Accra' },
  { id: 9, type: 'electric', name: 'Nissan Leaf', subtitle: 'Electric · Hatchback', price: 390, seats: 5, fuel: 'Electric', transmission: 'Auto', badge: 'electric', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=70', location: 'Kumasi' },
];

const FRONTEND_PARTS = [
  { id: 1, name: 'Brake Pads (Front Set)', price: 180, category: 'Brakes', brand: 'Bosch', inStock: true },
  { id: 2, name: 'Oil Filter - Toyota', price: 45, category: 'Filters', brand: 'Mann', inStock: true },
  { id: 3, name: 'Alternator 12V', price: 850, category: 'Electrical', brand: 'Valeo', inStock: true },
  { id: 4, name: 'Front Shock Absorber', price: 320, category: 'Suspension', brand: 'Sachs', inStock: false },
  { id: 5, name: 'Timing Belt Kit', price: 450, category: 'Engine', brand: 'Gates', inStock: true },
  { id: 6, name: 'Side Mirror (Left)', price: 120, category: 'Body Parts', brand: 'OEM', inStock: true },
  { id: 7, name: 'Tyre 205/55R16', price: 380, category: 'Tyres', brand: 'Michelin', inStock: true },
  { id: 8, name: 'Air Filter', price: 55, category: 'Filters', brand: 'K&N', inStock: true },
];

const FRONTEND_MECHANICS = [
  { id: 1, name: 'Kwame Auto Clinic', specialty: 'Engine & Transmission', location: 'Accra', rating: 4.8, reviews: 124, available: true },
  { id: 2, name: 'Adom Brake & Suspension', specialty: 'Brakes & Suspension', location: 'Kumasi', rating: 4.6, reviews: 89, available: true },
  { id: 3, name: 'Tech Auto Electrical', specialty: 'Electrical & AC', location: 'Accra', rating: 4.7, reviews: 67, available: false },
  { id: 4, name: 'Mighty Body Works', specialty: 'Body & Paint', location: 'Takoradi', rating: 4.5, reviews: 45, available: true },
  { id: 5, name: 'Quick Fix Diagnostics', specialty: 'Diagnostics & Scanning', location: 'Accra', rating: 4.9, reviews: 156, available: true },
  { id: 6, name: 'Reliable Tyre & Wheel', specialty: 'Tyres & Alignment', location: 'Tamale', rating: 4.4, reviews: 32, available: true },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const listingsService = app.get(ListingsService);
  const fleetService = app.get(FleetService);
  const sparePartsService = app.get(SparePartsService);
  const mechanicsService = app.get(MechanicsService);

  console.log('🌱 Starting frontend data migration...\n');

  // Create/verify demo seller account
  let seller = await usersService.findByEmail('demo.seller@trustautomobile.com');
  if (!seller) {
    seller = await usersService.create({
      name: 'Demo Motors Ghana',
      email: 'demo.seller@trustautomobile.com',
      password: 'password123',
      role: UserRole.SELLER,
      status: UserStatus.ACTIVE,
      phone: '+233501234567',
      location: 'Accra',
      profile: {
        businessName: 'Demo Motors Ghana',
        description: 'Trusted automobile dealership serving Ghana since 2015',
        address: '123 Independence Avenue',
        city: 'Accra',
        region: 'Greater Accra',
        verified: true,
      },
    });
    console.log('✅ Demo seller account created');
  } else {
    console.log('ℹ️ Demo seller account already exists');
  }
  const sellerId = seller._id.toString();

  // Create/verify parts dealer account
  let dealer = await usersService.findByEmail('demo.dealer@trustautomobile.com');
  if (!dealer) {
    dealer = await usersService.create({
      name: 'Auto Parts Plus',
      email: 'demo.dealer@trustautomobile.com',
      password: 'password123',
      role: UserRole.PARTS_DEALER,
      status: UserStatus.ACTIVE,
      phone: '+233502345678',
      location: 'Accra',
      profile: {
        businessName: 'Auto Parts Plus',
        description: 'Quality spare parts for all vehicle makes and models',
        address: '45 Spintex Road',
        city: 'Accra',
        region: 'Greater Accra',
        verified: true,
      },
    });
    console.log('✅ Demo parts dealer account created');
  } else {
    console.log('ℹ️ Demo parts dealer account already exists');
  }
  const dealerId = dealer._id.toString();

  // Create/verify mechanic account
  let mechanicUser = await usersService.findByEmail('demo.mechanic@trustautomobile.com');
  if (!mechanicUser) {
    mechanicUser = await usersService.create({
      name: 'Pro Auto Workshop',
      email: 'demo.mechanic@trustautomobile.com',
      password: 'password123',
      role: UserRole.MECHANIC,
      status: UserStatus.ACTIVE,
      phone: '+233503456789',
      location: 'Accra',
      profile: {
        businessName: 'Pro Auto Workshop',
        description: 'Professional automotive repair and maintenance services',
        address: '78 Ring Road Central',
        city: 'Accra',
        region: 'Greater Accra',
        verified: true,
      },
    });
    console.log('✅ Demo mechanic account created');
  } else {
    console.log('ℹ️ Demo mechanic account already exists');
  }
  const mechanicUserId = mechanicUser._id.toString();

  // Seed Car Listings
  console.log('\n📦 Seeding car listings...');
  let listingsCount = 0;
  for (const car of FRONTEND_CARS) {
    try {
      const fuelMap: any = {
        'Petrol': 'petrol',
        'Diesel': 'diesel',
        'Electric': 'electric',
        'Hybrid': 'hybrid',
        'CNG': 'lpg',
      };

      const transmissionMap: any = {
        'Automatic': 'automatic',
        'Manual': 'manual',
        'CVT': 'cvt',
      };

      await listingsService.create(sellerId, {
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: fuelMap[car.fuel] || 'petrol',
        transmission: transmissionMap[car.transmission] || 'automatic',
        color: car.badge === 'New' ? 'White' : 'Silver',
        location: car.location,
        description: car.desc,
        features: car.desc.includes('.') ? car.desc.split('.').filter(f => f.trim()).slice(0, 5) : ['Air Conditioning', 'Power Windows'],
        status: ListingStatus.ACTIVE,
        isFeatured: car.badge === 'Featured',
        featuredUntil: car.badge === 'Featured' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      });
      listingsCount++;
      console.log(`  ✅ ${car.make} ${car.model}`);
    } catch (error) {
      console.log(`  ⚠️ ${car.make} ${car.model} - may already exist`);
    }
  }
  console.log(`✅ Migrated ${listingsCount} car listings`);

  // Seed Fleet Cars
  console.log('\n🚗 Seeding rental fleet...');
  let fleetCount = 0;
  for (const car of FRONTEND_FLEET) {
    try {
      const categoryMap: any = {
        'economy': CarCategory.ECONOMY,
        'compact': CarCategory.COMPACT,
        'suv': CarCategory.SUV,
        'luxury': CarCategory.LUXURY,
        'electric': CarCategory.LUXURY,
        'minivan': CarCategory.VAN,
      };

      await fleetService.create({
        make: car.name.split(' ')[0],
        model: car.name.split(' ').slice(1).join(' '),
        year: 2022,
        dailyRate: car.price,
        category: categoryMap[car.type] || CarCategory.MIDSIZE,
        status: FleetCarStatus.AVAILABLE,
        image: car.img,
        description: car.subtitle,
        features: [car.transmission, car.fuel, `${car.seats} Seats`],
        specs: {
          transmission: car.transmission,
          fuelType: car.fuel,
          seats: car.seats,
          ac: true,
        },
        availableLocations: [car.location],
      });
      fleetCount++;
      console.log(`  ✅ ${car.name}`);
    } catch (error) {
      console.log(`  ⚠️ ${car.name} - may already exist`);
    }
  }
  console.log(`✅ Migrated ${fleetCount} fleet vehicles`);

  // Seed Spare Parts
  console.log('\n🔧 Seeding spare parts...');
  let partsCount = 0;
  for (const part of FRONTEND_PARTS) {
    try {
      await sparePartsService.create(dealerId, {
        name: part.name,
        category: part.category,
        price: part.price,
        brand: part.brand,
        status: part.inStock ? PartStatus.ACTIVE : PartStatus.OUT_OF_STOCK,
        stock: part.inStock ? 10 : 0,
        description: `Quality ${part.brand} ${part.name} for your vehicle`,
        compatibleMakes: ['Toyota', 'Honda', 'Nissan', 'Hyundai'],
        genuine: part.brand === 'OEM',
        negotiable: false,
        location: 'Accra',
      });
      partsCount++;
      console.log(`  ✅ ${part.name}`);
    } catch (error) {
      console.log(`  ⚠️ ${part.name} - may already exist`);
    }
  }
  console.log(`✅ Migrated ${partsCount} spare parts`);

  // Seed Mechanics
  console.log('\n🔨 Seeding mechanics...');
  let mechanicsCount = 0;
  for (const mechanic of FRONTEND_MECHANICS) {
    try {
      // Create mechanic profile
      const mechanicProfile = await mechanicsService.create(mechanicUserId, {
        workshopName: mechanic.name,
        description: `Professional ${mechanic.specialty} services`,
        address: `${mechanic.location} Industrial Area`,
        city: mechanic.location,
        region: mechanic.location === 'Accra' ? 'Greater Accra' : mechanic.location === 'Kumasi' ? 'Ashanti' : mechanic.location === 'Tamale' ? 'Northern' : 'Western',
        status: mechanic.available ? MechanicStatus.ACTIVE : MechanicStatus.BUSY,
        specializations: mechanic.specialty.split(' & '),
        services: [mechanic.specialty, 'General Maintenance', 'Vehicle Inspection'],
        rating: mechanic.rating,
        reviewCount: mechanic.reviews,
        workingHours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '15:00', closed: false },
          sunday: { open: '', close: '', closed: true },
        },
        mobileService: true,
        emergencyService: mechanic.available,
        yearsOfExperience: Math.floor(Math.random() * 15) + 5,
        completedJobs: mechanic.reviews * 3,
        certifications: ['ASE Certified', 'Ghana Auto Association'],
      });

      // Update with unique user for each mechanic if needed
      mechanicsCount++;
      console.log(`  ✅ ${mechanic.name}`);
    } catch (error) {
      console.log(`  ⚠️ ${mechanic.name} - may already exist`);
    }
  }
  console.log(`✅ Migrated ${mechanicsCount} mechanics`);

  console.log('\n═══════════════════════════════════════════');
  console.log('✅ Frontend data migration completed!');
  console.log('═══════════════════════════════════════════');
  console.log('\nDemo Accounts:');
  console.log('  • Seller: demo.seller@trustautomobile.com / password123');
  console.log('  • Dealer: demo.dealer@trustautomobile.com / password123');
  console.log('  • Mechanic: demo.mechanic@trustautomobile.com / password123');
  console.log('\nNext steps:');
  console.log('  1. Update frontend components to use API instead of hardcoded data');
  console.log('  2. Import { api } from "../utils/api" in your components');
  console.log('  3. Replace hardcoded data with: const data = await api.getListings()');

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
