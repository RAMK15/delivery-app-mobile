import { Request, Response } from 'express';
import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menu.model';
import { asyncHandler } from '../utils/response';
import { generateRandomCoordinates } from '../utils/location';
import dummyData from '../data/dummy-restaurants.json';

const getDishes = (cuisine: string) => {
  let dishes = [];
  if (cuisine === 'North Indian') {
    dishes = [...dummyData.commonDishes.northIndian];
  } else if (cuisine === 'South Indian') {
    dishes = [...dummyData.commonDishes.southIndian];
  } else {
    dishes = [...dummyData.commonDishes.fastFood];
  }
  
  // Add some random price variation and map to schema
  return dishes.map(dish => ({
    name: dish.name,
    description: dish.description,
    price: Math.round(dish.price * (0.8 + Math.random() * 0.4)), // ±20% price variation
    category: mapCategory(dish.category),
    isAvailable: true
  }));
};

const mapCategory = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'Starters': 'appetizer',
    'Main Course': 'main_course',
    'Desserts': 'dessert',
    'Beverages': 'beverage',
    'Side': 'side'
  };
  return categoryMap[category] || 'main_course';
};

const generateRestaurantData = (index: number) => {
  const centerLat = 24.491167;
  const centerLng = 86.687053;
  const coordinates = generateRandomCoordinates(centerLat, centerLng, 15);
  
  const cuisineTypes = dummyData.cuisineTypes;
  // Randomly select 1-3 cuisine types
  const numCuisines = Math.floor(Math.random() * 2) + 1; // 1 or 2 cuisines
  const selectedCuisines: string[] = [];
  
  for (let i = 0; i < numCuisines; i++) {
    const availableCuisines = cuisineTypes.filter(c => !selectedCuisines.includes(c));
    if (availableCuisines.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCuisines.length);
      selectedCuisines.push(availableCuisines[randomIndex]);
    }
  }
  
  const primaryCuisine = selectedCuisines[0];
  
  const restaurantTypes = {
    'North Indian': ['Spice', 'Tandoor', 'Dhaba', 'Kitchen', 'Palace'],
    'South Indian': ['Dosa', 'Udupi', 'Sagar', 'Express', 'Kitchen'],
    'Chinese': ['Wok', 'Dragon', 'Garden', 'House', 'Kitchen'],
    'Pizza': ['Pizza', 'Pizzeria', 'Slice', 'House', 'Kitchen'],
    'Fast Food': ['Burger', 'Express', 'Joint', 'Cafe', 'Kitchen']
  };

  const getRandomName = (cuisine: string) => {
    const types = restaurantTypes[cuisine as keyof typeof restaurantTypes] || restaurantTypes['North Indian'];
    const adjectives = ['Royal', 'Tasty', 'Delicious', 'Fresh', 'Golden'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    return `${adj} ${type} ${index + 1}`;
  };

  return {
    name: getRandomName(primaryCuisine),
    description: `Best ${selectedCuisines.join(' & ')} restaurant in the area`,
    cuisineType: selectedCuisines,
    priceRange: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
    rating: Math.floor(Math.random() * 5),
    address: {
      street: `${Math.floor(Math.random() * 999) + 1} Main Street`,
      city: 'Deoghar',
      state: 'Jharkhand',
      zipCode: '814112'
    },
    location: {
      type: 'Point',
      coordinates: coordinates
    },
    openingHours: [
      {
        day: 'Monday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Tuesday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Wednesday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Thursday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Friday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Saturday',
        open: '11:00',
        close: '23:00'
      },
      {
        day: 'Sunday',
        open: '11:00',
        close: '23:00'
      }
    ],
    phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: `restaurant${index + 1}@example.com`,
    website: `http://restaurant${index + 1}.example.com`,
    images: [],
    status: 'open'
  };
};

// @desc    Populate dummy restaurants and menu items
// @route   POST /api/dummy/populate
// @access  Private (Admin only)
export const populateDummyData = asyncHandler(async (req: Request, res: Response) => {
  // Clear existing data
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});

  const restaurants = [];
  const menuItems = [];

  // Generate 100 restaurants
  for (let i = 0; i < 100; i++) {
    const restaurantData = generateRestaurantData(i);
    const restaurant = await Restaurant.create({
      ...restaurantData,
      owner: req.user._id
    });
    restaurants.push(restaurant);

    // Generate menu items based on the primary cuisine
    const dishes = getDishes(restaurantData.cuisineType[0]);
    for (const dish of dishes) {
      const menuItem = await MenuItem.create({
        ...dish,
        restaurant: restaurant._id
      });
      menuItems.push(menuItem);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      restaurants: restaurants.length,
      menuItems: menuItems.length
    }
  });
}); 