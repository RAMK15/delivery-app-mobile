import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const twilioClient = twilio(accountSid, authToken);

// Function to send SMS
export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  console.debug(accountSid, authToken, process.env.TWILIO_PHONE_NUMBER);

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: to,
    });
    return true; // SMS sent successfully
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false; // SMS failed to send
  }
};

export const generateOTP = (): string => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatPhoneNumber = (phoneNumber: string, countryCode: string = '+1'): string => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // If the number doesn't start with +, add the country code
  if (!cleaned.startsWith('+')) {
    return `${countryCode}${cleaned}`;
  }
  
  return cleaned;
}; 