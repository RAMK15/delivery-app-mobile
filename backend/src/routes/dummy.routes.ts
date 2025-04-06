import express from 'express';
import { populateDummyData } from '../controllers/dummy.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.post('/populate', protect, authorize(UserRole.ADMIN), populateDummyData);

export default router; 