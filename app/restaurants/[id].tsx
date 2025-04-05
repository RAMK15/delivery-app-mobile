import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Text } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '../../contexts/CartContext';

const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://source.unsplash.com/random/100x100?pizza',
  },
  {
    id: 2,
    name: 'Spaghetti Carbonara',
    description: 'Pasta with eggs, cheese, pancetta, and black pepper',
    price: 14.99,
    image: 'https://source.unsplash.com/random/100x100?pasta',
  },
  {
    id: 3,
    name: 'Tiramisu',
    description: 'Coffee-flavored Italian dessert',
    price: 6.99,
    image: 'https://source.unsplash.com/random/100x100?dessert',
  },
];

const restaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    image: 'https://source.unsplash.com/random/400x200?restaurant,italian',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '30-40 min',
    priceRange: '$$',
  },
  {
    id: 2,
    name: 'Sushi Master',
    image: 'https://source.unsplash.com/random/400x200?restaurant,japanese',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '25-35 min',
    priceRange: '$$$',
  },
  {
    id: 3,
    name: 'Burger House',
    image: 'https://source.unsplash.com/random/400x200?restaurant,burger',
    cuisine: 'American',
    rating: 4.2,
    deliveryTime: '20-30 min',
    priceRange: '$',
  },
];

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addItem, items, updateQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const restaurant = restaurants.find((r) => r.id === Number(id));

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const getItemQuantity = (itemId: number) => {
    const cartItem = items.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item: any) => {
    const existingQuantity = getItemQuantity(item.id);
    if (existingQuantity === 0) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurant: restaurant.name,
      });
    } else {
      updateQuantity(item.id, 1);
    }
  };

  const handleRemoveFromCart = (itemId: number) => {
    updateQuantity(itemId, -1);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredMenuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuItemImage} />
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              {getItemQuantity(item.id) > 0 && (
                <>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleRemoveFromCart(item.id)}
                  >
                    <MaterialIcons name="remove" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {getItemQuantity(item.id)}
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <MaterialIcons name="add" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 90,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
}); 