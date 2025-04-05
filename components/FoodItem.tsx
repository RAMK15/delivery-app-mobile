import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../contexts/CartContext';

interface FoodItemProps {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  image: string;
}

export const FoodItem: React.FC<FoodItemProps> = ({
  id,
  name,
  restaurant,
  price,
  image,
}) => {
  console.warn('FoodItem rendered:', { id, name });
  const { addItem } = useCart();

  const handleAddToCart = () => {
    console.warn('Add button clicked for item:', { id, name, price });
    try {
      console.warn('Attempting to add item to cart');
      addItem({
        id,
        name,
        restaurant,
        price,
        image,
      });
      Alert.alert('Success', 'Item added to cart!');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.restaurant}>{restaurant}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddToCart}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurant: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 