import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { name, email, address } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { name, email, address },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user profile' });
    }
  }

  async getOrderHistory(req: AuthRequest, res: Response) {
    try {
      const orders = await Order.find({ user: req.user?.id })
        .populate('restaurant', 'name')
        .populate('items.menuItem', 'name price')
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching order history' });
    }
  }

  async getFavorites(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id)
        .populate('favorites', 'name cuisine rating');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching favorites' });
    }
  }

  async addToFavorites(req: AuthRequest, res: Response) {
    try {
      const { restaurantId } = req.params;
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { $addToSet: { favorites: restaurantId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Restaurant added to favorites' });
    } catch (error) {
      res.status(500).json({ error: 'Error adding restaurant to favorites' });
    }
  }

  async removeFromFavorites(req: AuthRequest, res: Response) {
    try {
      const { restaurantId } = req.params;
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { $pull: { favorites: restaurantId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Restaurant removed from favorites' });
    } catch (error) {
      res.status(500).json({ error: 'Error removing restaurant from favorites' });
    }
  }
} 