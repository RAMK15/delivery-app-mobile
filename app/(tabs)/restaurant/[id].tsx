import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart, CartItem } from '@/contexts/CartContext';

const restaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    image: 'https://source.unsplash.com/random/800x400?restaurant,italian',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '30-40 min',
    priceRange: '$$',
  },
  {
    id: 2,
    name: 'Sushi Master',
    image: 'https://source.unsplash.com/random/800x400?restaurant,japanese',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$$',
  },
  {
    id: 3,
    name: 'Burger House',
    image: 'https://source.unsplash.com/random/800x400?restaurant,burger',
    cuisine: 'American',
    rating: 4.2,
    deliveryTime: '20-30 min',
    priceRange: '$',
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    image: 'https://source.unsplash.com/random/800x400?restaurant,mexican',
    cuisine: 'Mexican',
    rating: 4.3,
    deliveryTime: '25-35 min',
    priceRange: '$$',
  },
  {
    id: 5,
    name: 'Curry House',
    image: 'https://source.unsplash.com/random/800x400?restaurant,indian',
    cuisine: 'Indian',
    rating: 4.6,
    deliveryTime: '35-45 min',
    priceRange: '$$',
  },
];

const menuItems = {
  1: [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      image: 'https://source.unsplash.com/random/200x200?pizza',
    },
    {
      id: 2,
      name: 'Spaghetti Carbonara',
      description: 'Pasta with eggs, cheese, pancetta, and black pepper',
      price: 14.99,
      image: 'https://source.unsplash.com/random/200x200?pasta',
    },
    {
      id: 3,
      name: 'Tiramisu',
      description: 'Coffee-flavored Italian dessert',
      price: 7.99,
      image: 'https://source.unsplash.com/random/200x200?tiramisu',
    },
  ],
  2: [
    {
      id: 1,
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber roll',
      price: 8.99,
      image: 'https://source.unsplash.com/random/200x200?sushi',
    },
    {
      id: 2,
      name: 'Salmon Nigiri',
      description: 'Fresh salmon over pressed rice',
      price: 6.99,
      image: 'https://source.unsplash.com/random/200x200?sushi,nigiri',
    },
    {
      id: 3,
      name: 'Miso Soup',
      description: 'Traditional Japanese soup with tofu and seaweed',
      price: 4.99,
      image: 'https://source.unsplash.com/random/200x200?miso,soup',
    },
  ],
  3: [
    {
      id: 1,
      name: 'Classic Burger',
      description: 'Beef patty with lettuce, tomato, and special sauce',
      price: 9.99,
      image: 'https://source.unsplash.com/random/200x200?burger',
    },
    {
      id: 2,
      name: 'Cheese Fries',
      description: 'Crispy fries topped with melted cheese',
      price: 5.99,
      image: 'https://source.unsplash.com/random/200x200?fries',
    },
    {
      id: 3,
      name: 'Chocolate Shake',
      description: 'Creamy chocolate milkshake',
      price: 4.99,
      image: 'https://source.unsplash.com/random/200x200?milkshake',
    },
  ],
  4: [
    {
      id: 1,
      name: 'Beef Tacos',
      description: 'Three soft tacos with seasoned beef',
      price: 10.99,
      image: 'https://source.unsplash.com/random/200x200?tacos',
    },
    {
      id: 2,
      name: 'Quesadilla',
      description: 'Grilled tortilla with cheese and chicken',
      price: 8.99,
      image: 'https://source.unsplash.com/random/200x200?quesadilla',
    },
    {
      id: 3,
      name: 'Churros',
      description: 'Fried dough pastry with cinnamon sugar',
      price: 4.99,
      image: 'https://source.unsplash.com/random/200x200?churros',
    },
  ],
  5: [
    {
      id: 1,
      name: 'Butter Chicken',
      description: 'Tender chicken in creamy tomato sauce',
      price: 13.99,
      image: 'https://source.unsplash.com/random/200x200?butter,chicken',
    },
    {
      id: 2,
      name: 'Vegetable Biryani',
      description: 'Fragrant rice dish with mixed vegetables',
      price: 11.99,
      image: 'https://source.unsplash.com/random/200x200?biryani',
    },
    {
      id: 3,
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in sugar syrup',
      price: 4.99,
      image: 'https://source.unsplash.com/random/200x200?gulab,jamun',
    },
  ],
};

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurantId = parseInt(id, 10);
  const [searchQuery, setSearchQuery] = useState('');
  const { items, addItem, updateQuantity } = useCart();

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const currentMenuItems = menuItems[restaurantId as keyof typeof menuItems] || [];

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const filteredMenuItems = currentMenuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemQuantity = (itemId: number): number => {
    const cartItem = items.find(
      (item: CartItem) => 
        item.id === itemId && 
        item.restaurant === restaurant.name
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item: typeof currentMenuItems[0]) => {
    console.log('Adding item to cart:', {
      id: item.id,
      name: item.name,
      restaurant: restaurant.name,
      price: item.price,
      image: item.image
    });
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurant: restaurant.name,
    };
    addItem(cartItem);
  };

  const handleUpdateQuantity = (itemId: number, change: number) => {
    console.log('Updating quantity:', {
      itemId,
      change,
      restaurant: restaurant.name
    });
    updateQuantity(itemId, change, restaurant.name);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Restaurant Header */}
      <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
      <View style={styles.headerInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
        </View>
        <Text style={styles.restaurantDetails}>
          {restaurant.cuisine} • {restaurant.priceRange} • {restaurant.deliveryTime}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {filteredMenuItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          
          return (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <Image source={{ uri: item.image }} style={styles.menuItemImage} />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                {quantity > 0 ? (
                  <>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, -1)}
                    >
                      <MaterialIcons name="remove" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <MaterialIcons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <MaterialIcons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerInfo: {
    padding: 20,
    backgroundColor: '#fff',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
  },
  restaurantDetails: {
    color: '#666',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemImage: {
    width: 100,
    height: 100,
  },
  menuItemInfo: {
    flex: 1,
    padding: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuItemDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  quantityButton: {
    backgroundColor: '#2ecc71',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 