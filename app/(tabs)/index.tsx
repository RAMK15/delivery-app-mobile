import { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const featuredRestaurants = [
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
];

const categories = [
  { id: 1, name: 'Pizza', icon: 'local-pizza' as const },
  { id: 2, name: 'Burger', icon: 'fastfood' as const },
  { id: 3, name: 'Sushi', icon: 'restaurant' as const },
  { id: 4, name: 'Salad', icon: 'eco' as const },
  { id: 5, name: 'Dessert', icon: 'icecream' as const },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: 'https://source.unsplash.com/random/800x400?food' }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Delicious Food Delivered</Text>
          <Text style={styles.heroSubtitle}>
            Order from your favorite restaurants
          </Text>
          <Link href="/restaurants" asChild>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Order Now</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ImageBackground>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => {}}
            >
              <View style={styles.categoryIcon}>
                <MaterialIcons name={category.icon} size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              asChild
            >
              <TouchableOpacity style={styles.restaurantCard}>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantDetails}>
                    {restaurant.cuisine} • {restaurant.rating} ★
                  </Text>
                  <Text style={styles.restaurantDelivery}>
                    {restaurant.deliveryTime}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hero: {
    height: 200,
    justifyContent: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    height: '100%',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
  },
  restaurantCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  restaurantDelivery: {
    fontSize: 14,
    color: '#FF6B6B',
  },
}); 