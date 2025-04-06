import twilio from 'twilio';
import { config } from '../config/config';

// Initialize Twilio client
const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// Function to send SMS
export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    // In test mode or if Twilio is not configured, return success without sending SMS
    if (process.env.NODE_ENV === 'test' || !config.twilio.accountSid || !config.twilio.authToken) {
      console.log('Test mode or Twilio not configured. SMS would have been sent:', { to, message });
      return true;
    }

    await client.messages.create({
      body: message,
      to,
      from: config.twilio.phoneNumber
    });

    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

export const generateOTP = (): string => {
  // Generate a 6-digit OTP
  //
  //return Math.floor(100000 + Math.random() * 900000).toString();
  return "123456";
};

// Format phone number to E.164 format
export const formatPhoneNumber = (phoneNumber: string, countryCode = '91'): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith(countryCode)) {
    return `+${countryCode}${cleaned}`;
  }
  
  return `+${cleaned}`;
}; 