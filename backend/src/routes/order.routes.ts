import express from 'express';
import { OrderController } from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';

const router = express.Router();
const orderController = new OrderController();

// Protected routes
router.use(protect);

// Public order details (requires auth)
router.get('/:id', orderController.getOrderById);

// Customer routes
router.post('/', authorize(UserRole.CUSTOMER), orderController.createOrder);
router.get('/user/orders', authorize(UserRole.CUSTOMER), orderController.getUserOrders);
router.post('/:id/cancel', authorize(UserRole.CUSTOMER), orderController.cancelOrder);

// Restaurant/Admin routes
router.put('/:id/status', authorize(UserRole.ADMIN, UserRole.RESTAURANT), orderController.updateOrderStatus);

export default router; 