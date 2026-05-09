import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ListingsService } from './listings/listings.service';
import { Mechanic } from './mechanics/schemas/mechanic.schema';
import { UserRole, UserStatus } from './users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

// ── Real Ghana GPS coordinates [longitude, latitude] ──────────────────────────
const GHANA_MECHANICS: Array<{
  name: string; email: string; workshopName: string; address: string;
  city: string; region: string; specializations: string[]; services: string[];
  location: [number, number]; phone: string; description: string;
  rating: number; reviewCount: number; completedJobs: number;
  yearsOfExperience: number; mobileService: boolean; emergencyService: boolean;
  certifications: string[];
}> = [
  // ── ACCRA ──
  {
    name: 'Kwame Asante', email: 'kwame.asante@mechanicghana.com',
    workshopName: 'Asante Auto Repairs', phone: '+233244123456',
    address: '15 Ring Road Central, Near Total Filling Station',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1869, 5.6037],
    specializations: ['Engine Repair', 'Transmission', 'Diagnostics'],
    services: ['Full Service', 'Oil Change', 'Brake Repair', 'Electrical'],
    description: 'Over 15 years of experience servicing all makes. Specialist in Toyota and Honda.',
    rating: 4.8, reviewCount: 124, completedJobs: 890, yearsOfExperience: 15,
    mobileService: false, emergencyService: true,
    certifications: ['GTUC Auto Tech', 'Toyota Certified Technician'],
  },
  {
    name: 'Ama Boateng', email: 'ama.boateng@osugarage.com',
    workshopName: 'Osu Premium Auto Center', phone: '+233208765432',
    address: 'No. 8 Cantonments Road, Osu',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1736, 5.5592],
    specializations: ['AC Repair', 'Electrical Systems', 'Body Work'],
    services: ['Air Conditioning', 'Electrical Repair', 'Panel Beating', 'Painting'],
    description: 'Accra\'s finest air conditioning and electrical workshop. All brands serviced.',
    rating: 4.6, reviewCount: 98, completedJobs: 650, yearsOfExperience: 11,
    mobileService: true, emergencyService: false,
    certifications: ['Valeo AC Certification', 'KNUST Automotive Engineering'],
  },
  {
    name: 'Kofi Mensah', email: 'kofi.mensah@airportauto.com',
    workshopName: 'Airport Auto Works', phone: '+233277345678',
    address: '4th Circular Road, Airport Residential',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1720, 5.6094],
    specializations: ['Suspension', 'Wheel Alignment', 'Brakes'],
    services: ['Wheel Alignment', 'Tyre Fitting', 'Suspension Overhaul', 'Brake Pads'],
    description: 'Precision wheel alignment and suspension specialists serving Accra Airport area.',
    rating: 4.7, reviewCount: 86, completedJobs: 540, yearsOfExperience: 9,
    mobileService: false, emergencyService: false,
    certifications: ['Hunter Alignment Certified', 'Bridgestone Tyre Tech'],
  },
  {
    name: 'Adjoa Tetteh', email: 'adjoa@lapazmotors.com',
    workshopName: 'Lapaz Motors Workshop', phone: '+233244987654',
    address: 'Lapaz Main Road, Near Lapaz Market',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.2486, 5.6098],
    specializations: ['General Maintenance', 'Engine Repair', 'Exhaust Systems'],
    services: ['Full Service', 'Oil & Filter Change', 'Exhaust Repair', 'Clutch Repair'],
    description: 'Trusted community workshop for over a decade. Affordable quality repairs.',
    rating: 4.4, reviewCount: 72, completedJobs: 1200, yearsOfExperience: 13,
    mobileService: false, emergencyService: false,
    certifications: ['Valvoline Service Partner'],
  },
  {
    name: 'Emmanuel Darko', email: 'e.darko@spintexauto.com',
    workshopName: 'Spintex Speed Workshop', phone: '+233553215678',
    address: 'Spintex Road, Near Mariam Junction',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1237, 5.6372],
    specializations: ['Performance Tuning', 'Engine Repair', 'Turbocharger'],
    services: ['Performance Upgrades', 'ECU Tuning', 'Turbo Install', 'Exhaust Upgrades'],
    description: 'Performance specialists. German, Japanese, and American car experts.',
    rating: 4.9, reviewCount: 157, completedJobs: 430, yearsOfExperience: 12,
    mobileService: false, emergencyService: false,
    certifications: ['Bosch Car Service Center', 'Performance Tuning Academy UK'],
  },
  {
    name: 'Abena Owusu', email: 'abena@dansomauto.com',
    workshopName: 'Dansoman Auto Care', phone: '+233200123456',
    address: 'Dansoman Roundabout, Behind Community Centre',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.2557, 5.5500],
    specializations: ['Transmission', 'Gearbox Repair', 'Clutch Systems'],
    services: ['Automatic Transmission', 'Manual Gearbox', 'Clutch Kit', 'Driveshaft'],
    description: 'Transmission and gearbox specialists. Same-day service available on most jobs.',
    rating: 4.5, reviewCount: 61, completedJobs: 320, yearsOfExperience: 8,
    mobileService: false, emergencyService: false,
    certifications: ['Aisin Transmission Certified'],
  },
  {
    name: 'Prince Boateng', email: 'prince@eastlegonauto.com',
    workshopName: 'East Legon Prestige Motors', phone: '+233244654321',
    address: 'American House Junction, East Legon',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1486, 5.6380],
    specializations: ['Luxury Cars', 'BMW', 'Mercedes-Benz', 'Diagnostics'],
    services: ['BMW Service', 'Mercedes Service', 'Audi Repair', 'OBD Diagnostics'],
    description: 'East Legon\'s premier luxury and European car specialists. Factory-level diagnostics.',
    rating: 4.9, reviewCount: 203, completedJobs: 750, yearsOfExperience: 16,
    mobileService: true, emergencyService: true,
    certifications: ['BMW Certified', 'Mercedes-Benz Approved', 'Autel Diagnostic Pro'],
  },
  {
    name: 'Nana Ama Acheampong', email: 'nana@madinaworkshop.com',
    workshopName: 'Madina Auto Solutions', phone: '+233277888999',
    address: 'Madina Zongo Junction, Main Road',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.1661, 5.6836],
    specializations: ['Electrical Systems', 'Car Audio', 'Security Systems'],
    services: ['Auto Electrical', 'Car Alarm Install', 'Tracker Fitting', 'Car Audio'],
    description: 'Northern Accra\'s best electrical and electronics workshop. CCTV and tracker experts.',
    rating: 4.3, reviewCount: 45, completedJobs: 280, yearsOfExperience: 7,
    mobileService: true, emergencyService: false,
    certifications: ['Viper Security Certified', 'Pioneer Audio Installer'],
  },
  {
    name: 'Yaw Darko', email: 'yaw@teshiemotors.com',
    workshopName: 'Teshie Speed Auto', phone: '+233244567890',
    address: 'Teshie Nungua Estate, Block C Road',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.0897, 5.5802],
    specializations: ['Japanese Cars', 'Engine Repair', 'Timing Belt'],
    services: ['Toyota Service', 'Honda Repair', 'Nissan Service', 'Timing Belt Replacement'],
    description: 'Japanese car specialists with over a decade of expertise in Toyota, Honda, Nissan.',
    rating: 4.6, reviewCount: 88, completedJobs: 670, yearsOfExperience: 10,
    mobileService: false, emergencyService: false,
    certifications: ['Toyota Technical Training'],
  },
  {
    name: 'Kwesi Appiah', email: 'kwesi@achimotagarage.com',
    workshopName: 'Achimota Full Service Garage', phone: '+233557654321',
    address: 'Achimota Overhead, Near Shell Station',
    city: 'Accra', region: 'Greater Accra',
    location: [-0.2250, 5.6156],
    specializations: ['Panel Beating', 'Spray Painting', 'Accident Repair'],
    services: ['Panel Beating', 'Spray Painting', 'Windscreen Replacement', 'Dent Removal'],
    description: 'Full bodywork and accident repair. Insurance-approved workshop. 1-year warranty on paint.',
    rating: 4.7, reviewCount: 134, completedJobs: 560, yearsOfExperience: 14,
    mobileService: false, emergencyService: false,
    certifications: ['3M Auto Paint Certified', 'NADEP Body Works Approved'],
  },

  // ── TEMA ──
  {
    name: 'Benjamin Asare', email: 'ben@temaauto.com',
    workshopName: 'Tema Industrial Auto', phone: '+233244901234',
    address: 'Community 9, Near Tema Police Station',
    city: 'Tema', region: 'Greater Accra',
    location: [-0.0044, 5.6698],
    specializations: ['Heavy Duty', 'Trucks', 'Engine Overhaul', 'Diesel Engines'],
    services: ['Truck Repair', 'Diesel Injection', 'Engine Overhaul', 'Hydraulics'],
    description: 'Tema port area experts. Heavy-duty, truck, and fleet maintenance specialists.',
    rating: 4.5, reviewCount: 77, completedJobs: 920, yearsOfExperience: 18,
    mobileService: false, emergencyService: true,
    certifications: ['Cummins Diesel Certified', 'MAN Trucks Ghana'],
  },
  {
    name: 'Gifty Asiedu', email: 'gifty@temaspeedshop.com',
    workshopName: 'Tema Speed Shop', phone: '+233208111222',
    address: 'Community 4 Junction, Tema',
    city: 'Tema', region: 'Greater Accra',
    location: [0.0120, 5.6560],
    specializations: ['Suspension', 'Exhaust', 'Performance'],
    services: ['Coilover Installation', 'Sports Exhaust', 'Cold Air Intake', 'Brake Upgrade'],
    description: 'Performance and modification specialists. Track day setup and sports car experts.',
    rating: 4.8, reviewCount: 112, completedJobs: 380, yearsOfExperience: 9,
    mobileService: false, emergencyService: false,
    certifications: ['KW Suspension Installer', 'Akrapovic Exhaust Tech'],
  },

  // ── KUMASI ──
  {
    name: 'Akwasi Frimpong', email: 'akwasi@suamemagazine.com',
    workshopName: 'Suame Magazine Auto Works', phone: '+233244321987',
    address: 'Suame Magazine Road, Shop 22B',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6482, 6.7158],
    specializations: ['Engine Repair', 'Fabrication', 'Welding', 'General Repairs'],
    services: ['Engine Rebuild', 'Custom Fabrication', 'Arc Welding', 'Suspension Fabrication'],
    description: 'Located in Ghana\'s famous Suame Magazine district. 20+ years of mechanical excellence.',
    rating: 4.7, reviewCount: 256, completedJobs: 2400, yearsOfExperience: 20,
    mobileService: false, emergencyService: false,
    certifications: ['NVTI Automotive Tech', 'Suame Industrial Development Trust'],
  },
  {
    name: 'Osei Bonsu', email: 'osei@kumasicentral.com',
    workshopName: 'Kumasi Central Motors', phone: '+233557123456',
    address: 'Adum Main Street, Near Kejetia',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6239, 6.6944],
    specializations: ['General Maintenance', 'Electrical', 'AC Repair'],
    services: ['Full Service', 'AC Recharge', 'Electrical Diagnostics', 'Battery'],
    description: 'Central Kumasi\'s go-to workshop for all makes. Same-day service guaranteed.',
    rating: 4.4, reviewCount: 89, completedJobs: 1100, yearsOfExperience: 12,
    mobileService: true, emergencyService: true,
    certifications: ['Mobil Service Partner'],
  },
  {
    name: 'Abena Prempeh', email: 'abena@bantamarepairs.com',
    workshopName: 'Bantama Auto Repairs', phone: '+233244789012',
    address: 'Bantama High Street, Opposite Santasi Road',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6447, 6.7044],
    specializations: ['Korean Cars', 'Hyundai', 'Kia', 'Diagnostics'],
    services: ['Hyundai Service', 'Kia Repair', 'Ssangyong Repair', 'OBD-II Scan'],
    description: 'Korean car specialists. Authorised service for Hyundai and Kia in Ashanti region.',
    rating: 4.6, reviewCount: 103, completedJobs: 780, yearsOfExperience: 11,
    mobileService: false, emergencyService: false,
    certifications: ['Hyundai Ghana Technical Partner'],
  },
  {
    name: 'Kwabena Adu', email: 'kwabena@asafoworks.com',
    workshopName: 'Asafo Auto Workshop', phone: '+233200456789',
    address: 'Asafo Market Road, Shop 4',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6378, 6.6739],
    specializations: ['Brakes', 'Wheel Alignment', 'Tyre Fitting'],
    services: ['Brake Overhaul', 'Tyre Fitting', 'Balancing', 'TPMS Repair'],
    description: 'Wheel and brake specialists. Wide stock of tyres for all car sizes.',
    rating: 4.3, reviewCount: 67, completedJobs: 920, yearsOfExperience: 8,
    mobileService: false, emergencyService: false,
    certifications: ['Dunlop Tyre Certified Dealer'],
  },
  {
    name: 'Francisca Owusu', email: 'franka@nhyiaesorepairs.com',
    workshopName: 'Nhyiaeso Premium Auto', phone: '+233277222333',
    address: 'Nhyiaeso Road, Near Kumasi South Hospital',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6095, 6.7026],
    specializations: ['Luxury Cars', 'European Brands', 'Diagnostics'],
    services: ['BMW', 'Audi', 'Volvo', 'Land Rover', 'Electronic Diagnostics'],
    description: 'European car specialists in Kumasi. Factory-trained technicians. German engineering expertise.',
    rating: 4.8, reviewCount: 91, completedJobs: 445, yearsOfExperience: 13,
    mobileService: true, emergencyService: false,
    certifications: ['BMW Approved Workshop', 'Volvo Service Partner', 'Snap-on Diagnostics'],
  },
  {
    name: 'Richard Boampong', email: 'richard@kwadasyouths.com',
    workshopName: 'Kwadaso Youth Auto Center', phone: '+233244567123',
    address: 'Kwadaso Estate, Block D',
    city: 'Kumasi', region: 'Ashanti',
    location: [-1.6728, 6.7078],
    specializations: ['Engine Repair', 'Injection Systems', 'Fuel Systems'],
    services: ['Common Rail Diesel', 'Fuel Injector Cleaning', 'Fuel Pump', 'DPF Cleaning'],
    description: 'Diesel and petrol injection specialists. Modern equipment, transparent pricing.',
    rating: 4.5, reviewCount: 55, completedJobs: 340, yearsOfExperience: 7,
    mobileService: false, emergencyService: false,
    certifications: ['Delphi Diesel Certification'],
  },

  // ── TAKORADI ──
  {
    name: 'Daniel Aidoo', email: 'daniel@takoradimotors.com',
    workshopName: 'Takoradi Central Auto', phone: '+233244678901',
    address: 'Market Circle Road, Takoradi',
    city: 'Takoradi', region: 'Western',
    location: [-1.7504, 4.8940],
    specializations: ['General Maintenance', 'Engine Repair', 'AC Repair'],
    services: ['Full Service', 'AC Service', 'Engine Tune-up', 'Tyre Service'],
    description: 'Takoradi\'s most trusted workshop. Serving the oil & gas community for 12 years.',
    rating: 4.6, reviewCount: 143, completedJobs: 1050, yearsOfExperience: 12,
    mobileService: true, emergencyService: true,
    certifications: ['Shell Lubricants Partner', 'Total Service Center'],
  },
  {
    name: 'Mabel Entsua', email: 'mabel@effiakumarepairs.com',
    workshopName: 'Effiakuma Auto Repairs', phone: '+233557890123',
    address: 'Effiakuma Road, Near Effia Nkwanta Hospital',
    city: 'Takoradi', region: 'Western',
    location: [-1.7752, 4.9038],
    specializations: ['Panel Beating', 'Spray Painting', 'Glass Replacement'],
    services: ['Accident Repair', 'Panel Beating', 'Car Painting', 'Windscreen'],
    description: 'Full bodywork specialist. Insurance claim repairs handled professionally.',
    rating: 4.4, reviewCount: 62, completedJobs: 490, yearsOfExperience: 9,
    mobileService: false, emergencyService: false,
    certifications: ['Glasurit Paint Certified', 'Ghana Insurance Auto Repair Approved'],
  },
  {
    name: 'Samuel Quansah', email: 'sam@newtakeworkshop.com',
    workshopName: 'New Takoradi Mechanics', phone: '+233244890234',
    address: 'New Takoradi, John Sarbah Road',
    city: 'Takoradi', region: 'Western',
    location: [-1.8113, 4.8925],
    specializations: ['Transmission', 'Differential', 'Drive Systems'],
    services: ['Automatic Gearbox', '4x4 Differential', 'Transfer Case', 'CV Joints'],
    description: 'Drive train and transmission experts. Specialists in 4WD off-road vehicle repair.',
    rating: 4.7, reviewCount: 78, completedJobs: 390, yearsOfExperience: 10,
    mobileService: false, emergencyService: false,
    certifications: ['ZF Transmission Certified', 'Land Rover Approved'],
  },
  {
    name: 'Mercy Amankwa', email: 'mercy@marketcircleauto.com',
    workshopName: 'Market Circle Auto Electricals', phone: '+233200765432',
    address: 'Ketan Market Circle, Shop 12',
    city: 'Takoradi', region: 'Western',
    location: [-1.7504, 4.8845],
    specializations: ['Auto Electrical', 'Alternator', 'Starter Motors'],
    services: ['Alternator Repair', 'Starter Motor', 'Battery Testing', 'Auto Electrical'],
    description: 'Electrical specialist with 8 years experience. Fast diagnostics, honest quotes.',
    rating: 4.3, reviewCount: 44, completedJobs: 560, yearsOfExperience: 8,
    mobileService: true, emergencyService: false,
    certifications: ['Bosch Auto Electrical Certified'],
  },

  // ── CAPE COAST ──
  {
    name: 'Kweku Mensah-Bonsu', email: 'kweku@capecoastmotors.com',
    workshopName: 'Cape Coast Motor Works', phone: '+233244345678',
    address: 'Cape Coast Bypass Road, Near UCC Junction',
    city: 'Cape Coast', region: 'Central',
    location: [-1.2466, 5.1053],
    specializations: ['General Maintenance', 'Engine Repair', 'Suspension'],
    services: ['Full Service', 'Suspension Repair', 'Wheel Alignment', 'Tyre Fitting'],
    description: 'Serving the Cape Coast community for over 10 years. Trusted by UCC staff and students.',
    rating: 4.5, reviewCount: 96, completedJobs: 870, yearsOfExperience: 10,
    mobileService: false, emergencyService: false,
    certifications: ['Castrol Edge Partner'],
  },
  {
    name: 'Philomena Amponsah', email: 'phil@capecoastpremium.com',
    workshopName: 'Cape Coast Premium Repairs', phone: '+233277567890',
    address: 'Jackson Street, Cape Coast Central',
    city: 'Cape Coast', region: 'Central',
    location: [-1.2400, 5.1080],
    specializations: ['AC Repair', 'Electrical', 'Diagnostics'],
    services: ['AC Regas', 'AC Compressor', 'Auto Electrical', 'ECU Diagnostics'],
    description: 'Central Region\'s leading AC and electrical repair center. Female-owned and operated.',
    rating: 4.7, reviewCount: 58, completedJobs: 320, yearsOfExperience: 6,
    mobileService: true, emergencyService: false,
    certifications: ['Denso AC Certification'],
  },

  // ── TAMALE ──
  {
    name: 'Ibrahim Mahama', email: 'ibrahim@tamaleauto.com',
    workshopName: 'Tamale Central Auto Workshop', phone: '+233244901567',
    address: 'Bolgatanga Road, Tamale Central',
    city: 'Tamale', region: 'Northern',
    location: [-0.8521, 9.4004],
    specializations: ['4x4 Repair', 'Engine Repair', 'Diesel'],
    services: ['4x4 Service', 'Land Cruiser Repair', 'Diesel Engine', 'NGO Fleet Service'],
    description: 'Northern Ghana\'s largest auto workshop. Specialists in NGO and 4x4 fleet vehicles.',
    rating: 4.6, reviewCount: 115, completedJobs: 1340, yearsOfExperience: 16,
    mobileService: true, emergencyService: true,
    certifications: ['Toyota Fleet Certified', 'UN Vehicle Fleet Maintenance'],
  },
  {
    name: 'Fatima Sulemana', email: 'fatima@tamalespeedrepairs.com',
    workshopName: 'Tamale Speed Repairs', phone: '+233557234567',
    address: 'Nyohini Junction, Tamale',
    city: 'Tamale', region: 'Northern',
    location: [-0.8400, 9.4100],
    specializations: ['General Maintenance', 'Motorcycles', 'Tuk-Tuks'],
    services: ['Car Service', 'Motorbike Repair', 'Tuk-Tuk Maintenance', 'Battery Service'],
    description: 'Full service for cars, motorbikes and keke (tuk-tuks). Affordable and fast.',
    rating: 4.2, reviewCount: 49, completedJobs: 760, yearsOfExperience: 7,
    mobileService: false, emergencyService: false,
    certifications: ['Yamaha Authorized Dealer'],
  },

  // ── HO ──
  {
    name: 'Delali Agbeko', email: 'delali@hoautoworks.com',
    workshopName: 'Ho Auto Works', phone: '+233244678234',
    address: 'Ho Roundabout, Near Volta Regional Hospital',
    city: 'Ho', region: 'Volta',
    location: [0.4716, 6.6111],
    specializations: ['General Maintenance', 'Engine Repair', 'Electrical'],
    services: ['Full Service', 'Engine Repair', 'Electrical', 'Tyre Service'],
    description: 'Volta Region\'s leading auto workshop. Reliable, affordable, professional.',
    rating: 4.4, reviewCount: 53, completedJobs: 540, yearsOfExperience: 8,
    mobileService: false, emergencyService: false,
    certifications: ['Mobil Service Center'],
  },

  // ── KOFORIDUA ──
  {
    name: 'Kwame Ofori', email: 'kwame@koforidua-motors.com',
    workshopName: 'Koforidua Motor Services', phone: '+233277345901',
    address: 'Koforidua Main Road, Near Bus Terminal',
    city: 'Koforidua', region: 'Eastern',
    location: [-0.2616, 6.0882],
    specializations: ['Engine Repair', 'Transmission', 'AC Repair'],
    services: ['Engine Overhaul', 'Gearbox Repair', 'AC Service', 'General Maintenance'],
    description: 'Eastern Region hub for quality auto repairs. Competitive pricing, experienced team.',
    rating: 4.5, reviewCount: 71, completedJobs: 680, yearsOfExperience: 11,
    mobileService: false, emergencyService: false,
    certifications: ['KNUST Auto Engineering Alumni'],
  },

  // ── SUNYANI ──
  {
    name: 'Eric Ampadu', email: 'eric@sunyanigarage.com',
    workshopName: 'Sunyani Auto Garage', phone: '+233244123789',
    address: 'Sunyani Market Road, Brong-Ahafo',
    city: 'Sunyani', region: 'Bono',
    location: [-2.3270, 7.3349],
    specializations: ['General Maintenance', 'Brakes', 'Suspension'],
    services: ['Full Service', 'Brake Repair', 'Shock Absorber', 'Wheel Balancing'],
    description: 'Bono Region\'s most trusted workshop. Serving farmers, traders and commuters since 2009.',
    rating: 4.3, reviewCount: 37, completedJobs: 490, yearsOfExperience: 12,
    mobileService: true, emergencyService: false,
    certifications: ['Shell Lubricants Approved'],
  },

  // ── OBUASI ──
  {
    name: 'Maxwell Kusi', email: 'maxwell@obuasimining-auto.com',
    workshopName: 'Obuasi Mining Auto Services', phone: '+233557890456',
    address: 'AngloGold Road, Obuasi',
    city: 'Obuasi', region: 'Ashanti',
    location: [-1.6774, 6.2028],
    specializations: ['Heavy Duty', 'Mining Equipment', 'Trucks', 'Hydraulics'],
    services: ['Mine Vehicles', 'Dump Truck Repair', 'Hydraulic Systems', 'Caterpillar Service'],
    description: 'Specialists in mining and heavy equipment. Supporting Ghana\'s gold mining communities.',
    rating: 4.6, reviewCount: 89, completedJobs: 1200, yearsOfExperience: 15,
    mobileService: false, emergencyService: true,
    certifications: ['Caterpillar Certified', 'AngloGold Ashanti Approved Contractor'],
  },
];

// ── Extra car listings for Ghana ───────────────────────────────────────────────
const EXTRA_LISTINGS = [
  { make: 'Toyota', model: 'Land Cruiser', year: 2019, price: 320000, mileage: 62000, transmission: 'automatic', fuelType: 'diesel', color: 'White', location: 'Accra', description: 'Bulletproof spec LC200 GX in pristine condition. Full bush-service history.', features: ['4WD', 'Leather Seats', 'Navigation', 'Sunroof', 'Backup Camera'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { make: 'Toyota', model: 'Hilux', year: 2021, price: 175000, mileage: 28000, transmission: 'manual', fuelType: 'diesel', color: 'Silver', location: 'Kumasi', description: 'Single-cab Hilux workhouse in excellent condition. Low mileage.', features: ['4WD', 'Alloy Wheels', 'Tow Bar', 'Bluetooth'] },
  { make: 'Hyundai', model: 'Tucson', year: 2022, price: 145000, mileage: 18000, transmission: 'automatic', fuelType: 'petrol', color: 'Blue', location: 'Accra', description: 'Latest Tucson with full panoramic roof and smart cruise control.', features: ['Sunroof', 'Smart Cruise', 'Lane Assist', 'Heated Seats', 'Wireless Charging'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { make: 'Ford', model: 'Ranger', year: 2020, price: 162000, mileage: 41000, transmission: 'automatic', fuelType: 'diesel', color: 'Black', location: 'Takoradi', description: 'Double-cab Ford Ranger Wildtrak. Perfect for Western Region terrain.', features: ['4WD', 'Sports Bar', 'Parking Sensors', 'Rear Camera', 'Apple CarPlay'] },
  { make: 'BMW', model: '3 Series', year: 2020, price: 195000, mileage: 34000, transmission: 'automatic', fuelType: 'petrol', color: 'Grey', location: 'Accra', description: 'G20 330i M Sport with full BMW service history. Factory spec.', features: ['M Sport Pack', 'Head-Up Display', 'Harman Kardon', 'Wireless Charging', 'LED Headlights'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { make: 'Kia', model: 'Sportage', year: 2021, price: 128000, mileage: 22000, transmission: 'automatic', fuelType: 'petrol', color: 'Red', location: 'Kumasi', description: 'Sporty Kia Sportage with smart features. Family SUV in great condition.', features: ['Sunroof', 'Rear Camera', 'Bluetooth', 'USB Ports', 'Alloy Wheels'] },
  { make: 'Nissan', model: 'X-Trail', year: 2019, price: 115000, mileage: 55000, transmission: 'automatic', fuelType: 'petrol', color: 'White', location: 'Accra', description: 'Spacious 7-seater X-Trail. Genuine Japanese import, well maintained.', features: ['7 Seats', 'Navigation', 'Backup Camera', 'Push Start', 'Roof Rails'] },
  { make: 'Volkswagen', model: 'Passat', year: 2018, price: 88000, mileage: 67000, transmission: 'automatic', fuelType: 'petrol', color: 'Black', location: 'Accra', description: 'Executive Passat with panoramic roof and adaptive cruise. German luxury.', features: ['Panoramic Roof', 'Adaptive Cruise', 'Lane Assist', 'Leather Seats', 'Park Assist'] },
  { make: 'Toyota', model: 'Corolla', year: 2020, price: 72000, mileage: 38000, transmission: 'automatic', fuelType: 'petrol', color: 'White', location: 'Cape Coast', description: 'Popular Toyota Corolla in top condition. Fuel-efficient daily driver.', features: ['Bluetooth', 'Backup Camera', 'Push Start', 'USB Charging', 'Alloy Wheels'] },
  { make: 'Honda', model: 'CR-V', year: 2019, price: 118000, mileage: 44000, transmission: 'automatic', fuelType: 'petrol', color: 'Silver', location: 'Accra', description: 'Spacious Honda CR-V with AWD. Family-friendly with great reliability.', features: ['AWD', 'Sunroof', 'Navigation', 'Heated Seats', 'Wireless Charging'] },
  { make: 'Hyundai', model: 'Elantra', year: 2021, price: 89000, mileage: 19000, transmission: 'automatic', fuelType: 'petrol', color: 'Blue', location: 'Tamale', description: 'Modern Elantra with sporty looks and economy. Almost new condition.', features: ['Smart Cruise', 'Lane Keep', 'Bluetooth', 'Backup Camera'] },
  { make: 'Toyota', model: 'RAV4', year: 2020, price: 148000, mileage: 31000, transmission: 'automatic', fuelType: 'hybrid', color: 'Dark Green', location: 'Accra', description: 'RAV4 Hybrid — best of both worlds. Exceptional fuel economy for Ghana roads.', features: ['Hybrid', 'AWD', 'Sunroof', 'JBL Audio', 'Pre-Collision System'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { make: 'Mercedes-Benz', model: 'GLE', year: 2021, price: 450000, mileage: 12000, transmission: 'automatic', fuelType: 'petrol', color: 'Black', location: 'Accra', description: 'Flagship GLE 450 AMG Line. The pinnacle of luxury SUVs. Imported directly from Germany.', features: ['AMG Line', 'Burmeister Audio', 'Air Suspension', 'Night Package', 'Heated Rear Seats'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { make: 'Lexus', model: 'RX', year: 2020, price: 265000, mileage: 24000, transmission: 'automatic', fuelType: 'hybrid', color: 'Pearl White', location: 'Accra', description: 'Lexus RX450h hybrid. Japanese luxury meets exceptional efficiency. Full service at Lexus Ghana.', features: ['Hybrid', 'Lexus Safety+', 'Mark Levinson Audio', 'Power Tailgate', 'Panoramic Roof'] },
  { make: 'Ford', model: 'Escape', year: 2019, price: 95000, mileage: 52000, transmission: 'automatic', fuelType: 'petrol', color: 'Orange', location: 'Koforidua', description: 'Compact Ford Escape with EcoBoost engine. Efficient and practical.', features: ['EcoBoost', 'SYNC 3', 'Reverse Camera', 'Alloy Wheels', 'Roof Rails'] },
  { make: 'Kia', model: 'Sorento', year: 2022, price: 168000, mileage: 11000, transmission: 'automatic', fuelType: 'petrol', color: 'Snow White', location: 'Kumasi', description: 'Premium Kia Sorento SX with 7 seats. Near-new condition with full warranty.', features: ['7 Seats', 'Bose Audio', 'Heads Up Display', 'Driver Attention', 'Panoramic Roof'] },
  { make: 'Nissan', model: 'Patrol', year: 2018, price: 225000, mileage: 78000, transmission: 'automatic', fuelType: 'petrol', color: 'White', location: 'Tamale', description: 'Legendary Nissan Patrol Y62. The king of northern Ghana roads. Well-maintained.', features: ['4x4', 'V8 Engine', '8 Seats', 'Bose Audio', 'Around View Monitor'] },
  { make: 'Toyota', model: 'Fortuner', year: 2021, price: 195000, mileage: 26000, transmission: 'automatic', fuelType: 'diesel', color: 'Grey', location: 'Takoradi', description: 'Rugged Toyota Fortuner 4x4 diesel. Built for Ghana\'s roads. Must be seen.', features: ['4x4', 'Diesel', 'Leather Seats', 'Navigation', 'Rear Camera', 'Alloy Wheels'] },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const listingsService = app.get(ListingsService);
  const mechanicModel = app.get(getModelToken(Mechanic.name));

  console.log('🌱 Starting full database seed...\n');

  // ── Admin user ──
  const adminExists = await usersService.findByEmail('admin@trustautomobile.com');
  if (!adminExists) {
    await usersService.create({
      name: 'Admin User', email: 'admin@trustautomobile.com', password: 'admin123',
      role: UserRole.ADMIN, status: UserStatus.ACTIVE,
    });
    console.log('✅ Admin user created');
  } else {
    console.log('⏭  Admin already exists');
  }

  // ── Primary seller ──
  let sellerId: string;
  const sellerExists = await usersService.findByEmail('seller@example.com');
  if (!sellerExists) {
    const seller = await usersService.create({
      name: 'Kwame Asante', email: 'seller@example.com', password: 'password123',
      role: UserRole.SELLER, status: UserStatus.ACTIVE, phone: '+233241234567', location: 'Accra',
      profile: { businessName: 'Asante Auto Sales', description: 'Trusted car dealer in Accra', address: '123 Main Street', city: 'Accra', region: 'Greater Accra', verified: true },
    });
    sellerId = seller._id.toString();
    console.log('✅ Seller user created');
  } else {
    sellerId = sellerExists._id.toString();
    console.log('⏭  Seller already exists');
  }

  // ── Car listings ──
  console.log('\n📦 Seeding car listings...');
  const baseListings = [
    { make: 'Toyota', model: 'Camry', year: 2020, price: 85000, mileage: 45000, transmission: 'automatic', fuelType: 'petrol', color: 'Silver', location: 'Accra', description: 'Well maintained Toyota Camry with full service history', features: ['Air Conditioning', 'Power Windows', 'Alloy Wheels', 'Bluetooth'] },
    { make: 'Honda', model: 'Civic', year: 2019, price: 65000, mileage: 32000, transmission: 'automatic', fuelType: 'petrol', color: 'Black', location: 'Kumasi', description: 'Clean Honda Civic in excellent condition', features: ['Sunroof', 'Leather Seats', 'Backup Camera'] },
    { make: 'Mercedes-Benz', model: 'C-Class', year: 2021, price: 150000, mileage: 15000, transmission: 'automatic', fuelType: 'petrol', color: 'White', location: 'Accra', description: 'Luxury Mercedes C-Class with premium features', features: ['Leather Seats', 'Navigation', 'Panoramic Roof', 'LED Headlights'], isFeatured: true, featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    ...EXTRA_LISTINGS,
  ];

  for (const listingData of baseListings) {
    try {
      await listingsService.create(sellerId, listingData);
      console.log(`  ✅ ${listingData.make} ${listingData.model} (${listingData.year})`);
    } catch {
      console.log(`  ⏭  ${listingData.make} ${listingData.model} may already exist`);
    }
  }

  // ── Mechanics ──
  console.log('\n🔧 Seeding 30 Ghana mechanics...');
  for (const m of GHANA_MECHANICS) {
    try {
      // Check if mechanic user already exists
      const existingUser = await usersService.findByEmail(m.email);
      let userId: string;

      if (!existingUser) {
        const mecUser = await usersService.create({
          name: m.name, email: m.email, password: 'mechanic123',
          role: UserRole.MECHANIC, status: UserStatus.ACTIVE,
          phone: m.phone, location: m.city,
          profile: { businessName: m.workshopName, description: m.description, address: m.address, city: m.city, region: m.region, verified: true },
        });
        userId = mecUser._id.toString();
      } else {
        userId = existingUser._id.toString();
      }

      // Create mechanic profile if not exists
      const existing = await mechanicModel.findOne({ user: userId });
      if (!existing) {
        await mechanicModel.create({
          user: userId,
          workshopName: m.workshopName,
          status: 'active',
          description: m.description,
          address: m.address,
          city: m.city,
          region: m.region,
          location: m.location,
          specializations: m.specializations,
          services: m.services,
          rating: m.rating,
          reviewCount: m.reviewCount,
          completedJobs: m.completedJobs,
          yearsOfExperience: m.yearsOfExperience,
          mobileService: m.mobileService,
          emergencyService: m.emergencyService,
          certifications: m.certifications,
          workingHours: {
            monday: { open: '08:00', close: '18:00', closed: false },
            tuesday: { open: '08:00', close: '18:00', closed: false },
            wednesday: { open: '08:00', close: '18:00', closed: false },
            thursday: { open: '08:00', close: '18:00', closed: false },
            friday: { open: '08:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '16:00', closed: false },
            sunday: { open: '10:00', close: '14:00', closed: true },
          },
        });
        console.log(`  ✅ ${m.workshopName} (${m.city})`);
      } else {
        console.log(`  ⏭  ${m.workshopName} already exists`);
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${m.workshopName}:`, err.message);
    }
  }

  console.log('\n✅ Full seed completed!');
  console.log(`   Listings: ${baseListings.length}`);
  console.log(`   Mechanics: ${GHANA_MECHANICS.length}`);
  await app.close();
  process.exit(0);
}

bootstrap().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
