# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


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


