import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/delivery-app',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  otpExpiryMinutes: 5,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
}; 