import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import restaurantRoutes from './routes/restaurant.routes';
import orderRoutes from './routes/order.routes';
import dummyRoutes from './routes/dummy.routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dummy', dummyRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Something went wrong!',
      status: err.status || 500
    }
  });
});

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 