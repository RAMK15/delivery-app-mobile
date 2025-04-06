# Delivery App Backend

A modern delivery application backend built with Node.js, Express, and MongoDB.

## Documentation

- [API Documentation](backend/API_DOCUMENTATION.md) - Detailed documentation of all API endpoints
- [Database Schema](backend/DATABASE_SCHEMA.md) - Complete database schema and relationships

## Quick Links

### API Endpoints Overview

- Authentication
  - `POST /api/auth/send-otp` - Send OTP for phone verification
  - `POST /api/auth/verify-otp` - Verify OTP and get access token

- Restaurants
  - `GET /api/restaurants` - List all restaurants
  - `GET /api/restaurants/:id` - Get restaurant details
  - `GET /api/restaurants/:id/menu` - Get restaurant menu

- Orders
  - `POST /api/orders` - Create new order
  - `GET /api/orders/:id` - Get order details
  - `PUT /api/orders/:id/status` - Update order status
  - `GET /api/orders/user/orders` - Get user's orders

For complete API documentation including request/response formats, authentication requirements, and examples, please refer to the [API Documentation](backend/API_DOCUMENTATION.md).

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB
5. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- 📱 Phone number based authentication with OTP
- 🔐 Role-based access control (Customer, Restaurant, Driver, Admin)
- 🍽️ Restaurant and menu management
- 📍 Location-based restaurant search
- 🛵 Real-time order tracking
- ⭐ Rating and review system
- 💳 Order management with status tracking

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- JWT Authentication
- Jest for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


