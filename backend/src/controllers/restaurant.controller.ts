import { Request, Response } from 'express';
import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menu.model';
import { Order } from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class RestaurantController {
  async getAllRestaurants(req: Request, res: Response) {
    try {
      const restaurants = await Restaurant.find();
      res.json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching restaurants'
      });
    }
  }

  async getRestaurantById(req: Request, res: Response) {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found'
        });
      }
      res.json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching restaurant'
      });
    }
  }

  async getRestaurantMenu(req: Request, res: Response) {
    try {
      const menuItems = await MenuItem.find({ restaurant: req.params.id });
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching menu' });
    }
  }

  async searchNearbyRestaurants(req: Request, res: Response) {
    try {
      const { latitude, longitude, radius = 5000 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }

      const restaurants = await Restaurant.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)]
            },
            $maxDistance: radius
          }
        }
      });

      res.json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error searching nearby restaurants'
      });
    }
  }

  async searchByCuisine(req: Request, res: Response) {
    try {
      const { cuisine } = req.params;
      const restaurants = await Restaurant.find({ cuisineType: cuisine });
      res.json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error searching restaurants by cuisine'
      });
    }
  }

  async createRestaurant(req: AuthRequest, res: Response) {
    try {
      const restaurant = new Restaurant({
        ...req.body,
        owner: req.user?.id
      });
      await restaurant.save();
      res.status(201).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error creating restaurant'
      });
    }
  }

  async updateRestaurant(req: AuthRequest, res: Response) {
    try {
      const restaurant = await Restaurant.findOneAndUpdate(
        { _id: req.params.id, owner: req.user?.id },
        req.body,
        { new: true }
      );

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: 'Error updating restaurant' });
    }
  }

  async deleteRestaurant(req: AuthRequest, res: Response) {
    try {
      const restaurant = await Restaurant.findOneAndDelete({
        _id: req.params.id,
        owner: req.user?.id
      });

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
      }

      res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting restaurant' });
    }
  }

  async updateRestaurantStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const restaurant = await Restaurant.findOneAndUpdate(
        { _id: req.params.id, owner: req.user?.id },
        { status },
        { new: true }
      );

      if (!restaurant) {
        return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: 'Error updating restaurant status' });
    }
  }

  async getRestaurantOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await Order.find({ restaurant: req.params.id })
        .populate('user', 'name phone')
        .populate('items.menuItem', 'name price')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching restaurant orders' });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findOneAndUpdate(
        { _id: orderId, restaurant: req.params.id },
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: 'Order not found or unauthorized' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Error updating order status' });
    }
  }
} 