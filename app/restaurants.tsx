import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart, CartItem } from '@/contexts/CartContext';

const restaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    image: 'https://source.unsplash.com/random/400x200?restaurant,italian',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '30-40 min',
  },
  {
    id: 2,
    name: 'Sushi Master',
    image: 'https://source.unsplash.com/random/400x200?restaurant,japanese',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '25-35 min',
  },
  {
    id: 3,
    name: 'Burger House',
    image: 'https://source.unsplash.com/random/400x200?restaurant,burger',
    cuisine: 'American',
    rating: 4.2,
    deliveryTime: '20-30 min',
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    image: 'https://source.unsplash.com/random/400x200?restaurant,mexican',
    cuisine: 'Mexican',
    rating: 4.3,
    deliveryTime: '25-35 min',
  },
  {
    id: 5,
    name: 'Curry House',
    image: 'https://source.unsplash.com/random/400x200?restaurant,indian',
    cuisine: 'Indian',
    rating: 4.6,
    deliveryTime: '35-45 min',
  },
];

export default function RestaurantsScreen() {
  const { cuisine } = useLocalSearchParams<{ cuisine: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !cuisine || restaurant.cuisine === cuisine;
    return matchesSearch && matchesCuisine;
  });

  const renderRestaurant = ({ item }: { item: typeof restaurants[0] }) => {
    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => router.push(`/restaurants/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.restaurantDetails}>
            {item.cuisine} • {item.deliveryTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {cuisine ? `${cuisine} Restaurants` : 'All Restaurants'}
        </Text>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.restaurantList}
        ListEmptyComponent={
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No restaurants found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  restaurantList: {
    padding: 20,
  },
  restaurantCard: {
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
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
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
    fontSize: 14,
  },
  restaurantDetails: {
    color: '#666',
    fontSize: 14,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
}); 