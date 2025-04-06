import { Request, Response } from 'express';
import { MenuItem } from '../models/menu.model';
import { Restaurant } from '../models/restaurant.model';
import { AuthRequest } from '../types/auth';

export class MenuController {
  // Get menu items for a restaurant
  async getMenuItems(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menuItems = await MenuItem.find({ restaurant: id });
      res.json({ success: true, data: menuItems });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error fetching menu items' });
    }
  }

  // Create a new menu item
  async createMenuItem(req: AuthRequest, res: Response) {
    try {
      const { name, description, price, category } = req.body;
      const restaurant = await Restaurant.findOne({ owner: req.user?._id });
      
      if (!restaurant) {
        return res.status(404).json({ success: false, error: 'Restaurant not found' });
      }

      const menuItem = await MenuItem.create({
        name,
        description,
        price,
        category,
        restaurant: restaurant._id
      });

      res.status(201).json({ success: true, data: menuItem });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error creating menu item' });
    }
  }

  // Update a menu item
  async updateMenuItem(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, category } = req.body;
      const restaurant = await Restaurant.findOne({ owner: req.user?._id });

      if (!restaurant) {
        return res.status(404).json({ success: false, error: 'Restaurant not found' });
      }

      const menuItem = await MenuItem.findOneAndUpdate(
        { _id: id, restaurant: restaurant._id },
        { name, description, price, category },
        { new: true }
      );

      if (!menuItem) {
        return res.status(404).json({ success: false, error: 'Menu item not found' });
      }

      res.json({ success: true, data: menuItem });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error updating menu item' });
    }
  }

  // Delete a menu item
  async deleteMenuItem(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findOne({ owner: req.user?._id });

      if (!restaurant) {
        return res.status(404).json({ success: false, error: 'Restaurant not found' });
      }

      const menuItem = await MenuItem.findOneAndDelete({ _id: id, restaurant: restaurant._id });

      if (!menuItem) {
        return res.status(404).json({ success: false, error: 'Menu item not found' });
      }

      res.json({ success: true, data: menuItem });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error deleting menu item' });
    }
  }
} 