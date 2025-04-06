import express from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Protected routes
router.use(protect);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/orders', userController.getOrderHistory);
router.get('/favorites', userController.getFavorites);

export default router; 