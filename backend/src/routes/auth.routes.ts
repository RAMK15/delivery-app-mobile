import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/auth.controller';

const router = express.Router();

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router; 