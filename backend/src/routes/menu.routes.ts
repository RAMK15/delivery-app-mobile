import express from 'express';
import { MenuController } from '../controllers/menu.controller';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../models/user.model';

const router = express.Router();
const menuController = new MenuController();

// Public routes
router.get('/restaurant/:id', menuController.getMenuItems);

// Restaurant owner routes
router.use(protect);
router.use(authorize(UserRole.RESTAURANT));
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

export default router; 