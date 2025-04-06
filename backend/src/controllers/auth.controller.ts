import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';
import { OTP } from '../models/otp.model';
import { sendSMS, generateOTP, formatPhoneNumber } from '../utils/sms';
import { asyncHandler, ApiResponse } from '../utils/response';
import { Types } from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware';
import { config } from '../config/config';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

// @desc    Send OTP for login/signup
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, countryCode } = req.body;

  if (!phoneNumber) {
    return ApiResponse.error(res, 'Phone number is required', 400);
  }

  // Format phone number to E.164 format
  const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);

  // Generate OTP
  const otp = generateOTP();

  // Calculate expiry (5 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  // Save OTP to database
  await OTP.findOneAndUpdate(
    { phoneNumber: formattedPhone, verified: false },
    {
      phoneNumber: formattedPhone,
      otp,
      expiresAt,
      verified: false,
    },
    { upsert: true, new: true }
  );

  // Send OTP via SMS
  const message = `Your OTP for Delivery App is: ${otp}. Valid for 5 minutes.`;
  const smsSent = await sendSMS(formattedPhone, message);

  if (!smsSent) {
    return ApiResponse.error(res, 'Failed to send OTP', 500);
  }

  return ApiResponse.success(res, null, 'OTP sent successfully');
});

// @desc    Verify OTP and login/signup user
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, otp, countryCode, name, role } = req.body;

  if (!phoneNumber || !otp) {
    return ApiResponse.error(res, 'Phone number and OTP are required', 400);
  }

  const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);

  // Find and verify OTP
  const otpRecord = await OTP.findOne({
    phoneNumber: formattedPhone,
    otp,
    verified: false,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    return ApiResponse.error(res, 'Invalid or expired OTP', 400);
  }

  // Mark OTP as verified
  otpRecord.verified = true;
  await otpRecord.save();

  // Find or create user
  let user = await User.findOne({ phone: formattedPhone });

  if (!user) {
    // Create new user if doesn't exist
    user = await User.create({
      phone: formattedPhone,
      name: name || 'User',
      role: role && Object.values(UserRole).includes(role as UserRole) ? role : UserRole.CUSTOMER,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
  } else if (role && Object.values(UserRole).includes(role as UserRole)) {
    // Update role if provided and valid
    user.role = role as UserRole;
    await user.save();
  }

  // Generate token
  const token = generateToken(user._id.toString());

  return ApiResponse.success(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  }, 'OTP verified successfully');
}); 