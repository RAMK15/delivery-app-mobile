import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database';
import { errorMiddleware } from './utils/response';
import authRoutes from './routes/auth.routes';

// Load env vars
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// TODO: Add other routes here
// app.use('/api/users', userRoutes);
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api/menu-items', menuItemRoutes);
// app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
});
