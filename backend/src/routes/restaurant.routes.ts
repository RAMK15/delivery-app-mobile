import express from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { MenuController } from '../controllers/menu.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';

const router = express.Router();
const restaurantController = new RestaurantController();
const menuController = new MenuController();

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:id/menu', menuController.getMenuItems);
router.get('/search/nearby', restaurantController.searchNearbyRestaurants);
router.get('/search/cuisine/:cuisine', restaurantController.searchByCuisine);

// Protected routes
router.use(protect);

// Restaurant owner routes
router.use(authorize(UserRole.RESTAURANT));
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);

// Restaurant management routes
router.put('/:id/status', restaurantController.updateRestaurantStatus);
router.get('/:id/orders', restaurantController.getRestaurantOrders);
router.put('/:id/orders/:orderId/status', restaurantController.updateOrderStatus);

export default router; 