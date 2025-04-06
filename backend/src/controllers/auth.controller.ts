import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, IUser } from '../models/User';
import { OTP } from '../models/OTP';
import { sendSMS, generateOTP, formatPhoneNumber } from '../utils/sms';
import { asyncHandler } from '../utils/response';
import { Types } from 'mongoose';

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Send OTP for login/signup
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, countryCode } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required',
    });
  }

  // Format phone number to E.164 format
  const formattedPhone = formatPhoneNumber(phoneNumber, countryCode);

  // Generate OTP
  const otp = generateOTP();

  // Calculate expiry (5 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

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
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }

  res.status(200).json({
    success: true,
    message: 'OTP sent successfully',
  });
});

// @desc    Verify OTP and login/signup user
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { phoneNumber, otp, countryCode, name } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required',
    });
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
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP',
    });
  }

  // Mark OTP as verified
  otpRecord.verified = true;
  await otpRecord.save();

  // Find or create user
  let user: (IUser & { _id: Types.ObjectId }) | null = await User.findOne({ phone: formattedPhone });

  if (!user) {
    // Create new user if doesn't exist
    user = await User.create({
      phone: formattedPhone,
      name: name || 'User',
      role: UserRole.CUSTOMER,
      address: {
        location: {
          type: 'Point',
          coordinates: [0, 0] // Default coordinates
        }
      }
    }) as IUser & { _id: Types.ObjectId };
  }

  // Generate token
  const token = generateToken(user._id.toString());

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    },
  });
}); 