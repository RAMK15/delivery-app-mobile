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
import { useCart } from '@/contexts/CartContext';

const restaurants = [
  {
    id: 1,
    name: 'Italian Bistro',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    cuisine: 'Pizza',
    rating: 4.5,
    priceLevel: '$$',
    deliveryTime: '30-40 min',
  },
  {
    id: 2,
    name: 'Burger King',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    cuisine: 'Burger',
    rating: 4.2,
    priceLevel: '$',
    deliveryTime: '20-30 min',
  },
  {
    id: 3,
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    cuisine: 'Sushi',
    rating: 4.8,
    priceLevel: '$$$',
    deliveryTime: '25-35 min',
  },
  {
    id: 4,
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    cuisine: 'Salad',
    rating: 4.3,
    priceLevel: '$$',
    deliveryTime: '15-25 min',
  },
  {
    id: 5,
    name: 'Sweet Treats',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    cuisine: 'Dessert',
    rating: 4.6,
    priceLevel: '$$',
    deliveryTime: '20-30 min',
  },
  {
    id: 6,
    name: 'Pizza Express',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    cuisine: 'Pizza',
    rating: 4.4,
    priceLevel: '$$',
    deliveryTime: '25-35 min',
  },
  {
    id: 7,
    name: 'Juice Bar',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38',
    cuisine: 'Drinks',
    rating: 4.7,
    priceLevel: '$',
    deliveryTime: '10-20 min',
  },
];

export default function RestaurantsScreen() {
  const params = useLocalSearchParams<{ cuisine: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !params.cuisine || restaurant.cuisine.toLowerCase() === params.cuisine.toLowerCase();
    return matchesSearch && matchesCuisine;
  });

  const renderRestaurant = ({ item }: { item: typeof restaurants[0] }) => {
    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.restaurantDetails}>
              {item.cuisine} • {item.priceLevel}
            </Text>
            <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {params.cuisine ? `${params.cuisine} Places` : 'All Restaurants'}
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
            <MaterialIcons name="restaurant" size={64} color="#ccc" />
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    padding: 15,
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
    height: 180,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantDetails: {
    color: '#666',
    fontSize: 14,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
}); 