# Trust Automobile API (TA-Server)

NestJS backend for Ghana's #1 Verified Car Marketplace.

## Features

- **Authentication**: JWT-based auth with role-based access control
- **User Management**: Multiple roles (buyer, seller, mechanic, renter, parts dealer, admin)
- **Car Listings**: Full CRUD for car listings with filtering
- **Rental Fleet**: Car rental management
- **Spare Parts**: Parts marketplace for verified dealers
- **Mechanic Services**: Workshop directory with geolocation
- **Admin Panel**: User and listing management

## Tech Stack

- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── listings/          # Car listings
├── fleet/             # Rental cars
├── spare-parts/       # Spare parts marketplace
├── mechanics/         # Mechanic directory
├── common/            # Guards, decorators, interceptors
├── main.ts            # Application entry
└── app.module.ts      # Root module
```

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run start:dev
```

## Environment Variables

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/trust_automobile
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users` - List users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `GET /api/v1/users/me` - Get current profile

### Listings
- `GET /api/v1/listings` - Get listings with filters
- `GET /api/v1/listings/featured` - Featured listings
- `GET /api/v1/listings/makes` - Get car makes
- `POST /api/v1/listings` - Create listing
- `GET /api/v1/listings/:id` - Get single listing

### Fleet (Rental)
- `GET /api/v1/fleet` - Get fleet cars
- `GET /api/v1/fleet/available` - Available cars
- `GET /api/v1/fleet/categories` - Car categories

### Spare Parts
- `GET /api/v1/spare-parts` - Get parts with filters
- `GET /api/v1/spare-parts/categories` - Part categories
- `POST /api/v1/spare-parts` - Create part listing

### Mechanics
- `GET /api/v1/mechanics` - Get mechanics
- `GET /api/v1/mechanics/nearby` - Find nearby
- `GET /api/v1/mechanics/specializations` - Specializations

## API Documentation

Once running, access Swagger docs at:
```
http://localhost:3001/api/docs
```

## Database Seeding

Run the seed script to add sample data:
```bash
npm run seed
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## License
MIT
