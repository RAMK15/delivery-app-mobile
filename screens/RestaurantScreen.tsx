import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FoodItem } from '../components/FoodItem';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const menuItems: Record<number, MenuItem[]> = {
  1: [
    {
      id: 1,
      name: 'Classic Burger',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50',
    },
    {
      id: 2,
      name: 'Cheese Burger',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50',
    },
  ],
  2: [
    {
      id: 3,
      name: 'Margherita Pizza',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    },
    {
      id: 4,
      name: 'Pepperoni Pizza',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    },
  ],
  3: [
    {
      id: 5,
      name: 'California Roll',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    },
    {
      id: 6,
      name: 'Salmon Roll',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    },
  ],
};

export const RestaurantScreen = () => {
  console.warn('RestaurantScreen rendered');
  const route = useRoute();
  const { restaurantId } = route.params as { restaurantId: number };
  const items = menuItems[restaurantId] || [];

  const renderItem = ({ item }: { item: MenuItem }) => (
    <FoodItem
      id={item.id}
      name={item.name}
      restaurant={restaurantId === 1 ? 'Burger Palace' : restaurantId === 2 ? 'Pizza Heaven' : 'Sushi World'}
      price={item.price}
      image={item.image}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 