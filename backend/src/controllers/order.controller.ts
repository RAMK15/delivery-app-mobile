import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menu.model';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';
import { UserRole } from '../models/user.model';
import { Console } from 'console';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { restaurantId, items, deliveryAddress } = req.body;

      // Validate restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found'
        });
      }

      // Calculate order total
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem) {
          return res.status(404).json({
            success: false,
            error: `Menu item ${item.menuItem} not found`
          });
        }

        let itemTotal = menuItem.price * item.quantity;
        
        // Add customization costs
        if (item.customizations) {
          for (const customization of item.customizations) {
            itemTotal += customization.price;
          }
        }

        subtotal += itemTotal;
        orderItems.push({
          menuItem: item.menuItem,
          quantity: item.quantity,
          price: itemTotal / item.quantity, // Price per unit including customizations
          notes: item.notes,
          customizations: item.customizations
        });
      }

      // Calculate fees and total
      const tax = subtotal * 0.1; // 10% tax
      const deliveryFee = 5; // Fixed delivery fee
      const total = subtotal + tax + deliveryFee;

      const order = new Order({
        user: req.user.id,
        restaurant: restaurantId,
        items: orderItems,
        deliveryAddress,
        status: OrderStatus.PENDING,
        totalAmount: total,
        subtotal,
        tax,
        deliveryFee,
        paymentStatus: 'pending'
      });

      await order.save();
      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error creating order'
      });
    }
  }

  async getUserOrders(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const orders = await Order.find({ user: req.user.id })
        .populate('restaurant', 'name')
        .populate('items.menuItem', 'name price')
        .sort({ createdAt: -1 });
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching orders'
      });
    }
  }

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const order = await Order.findById(req.params.id)
        .populate('restaurant', 'name')
        .populate('items.menuItem', 'name price')
        .populate('user', 'name phone')
        .populate('driver', 'name phone');

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Get restaurant details to check owner
      const restaurant = await Restaurant.findById(order.restaurant);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found'
        });
      }

      // Check access permission - allow admin access to all orders
      const isAdmin = req.user.role === UserRole.ADMIN;
      const isCustomer = order.user.id.toString() === req.user.id;
      const isRestaurantOwner = restaurant.owner.toString() === req.user.id;
      const isDriver = order.driver && order.driver.toString() === req.user.id;

      console.log("order_id", order.id, req.user.role, "user_id", req.user.id, isAdmin, order.user.id.toString(), isCustomer, restaurant.owner.toString(), isRestaurantOwner, order.driver?.toString(), isDriver);


      const isAuthorized = isAdmin || isCustomer || isRestaurantOwner || isDriver;

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to view this order'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching order'
      });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const { status, note } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      // Check if user is admin or the restaurant owner
      const restaurant = await Restaurant.findById(order.restaurant);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: 'Restaurant not found'
        });
      }

      const isAdmin = req.user.role === UserRole.ADMIN;
      const isRestaurantOwner = restaurant.owner.toString() === req.user.id;

      if (!isAdmin && !isRestaurantOwner) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this order'
        });
      }

      // Validate status transition
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid order status'
        });
      }

      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || undefined
      });

      await order.save();

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating order status'
      });
    }
  }

  async cancelOrder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.id,
        status: { $nin: [OrderStatus.DELIVERED, OrderStatus.CANCELLED] }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found or cannot be cancelled'
        });
      }

      order.status = OrderStatus.CANCELLED;
      order.statusHistory.push({
        status: OrderStatus.CANCELLED,
        timestamp: new Date(),
        note: 'Cancelled by customer'
      });

      await order.save();
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error cancelling order'
      });
    }
  }
} 