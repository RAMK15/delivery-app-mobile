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
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

const featuredRestaurants = [
  {
    id: '1',
    name: 'Italian Bistro',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    rating: 4.5,
    cuisine: 'Italian',
    priceLevel: '$$',
    deliveryTime: '30-40 min',
  },
  {
    id: '2',
    name: 'Sushi Master',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    rating: 4.8,
    cuisine: 'Japanese',
    priceLevel: '$$$',
    deliveryTime: '25-35 min',
  },
  {
    id: '3',
    name: 'Burger House',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    rating: 4.3,
    cuisine: 'American',
    priceLevel: '$$',
    deliveryTime: '20-30 min',
  },
];

const categories = [
  { id: 'pizza', name: 'Pizza', icon: 'pizza' },
  { id: 'burger', name: 'Burger', icon: 'hamburger' },
  { id: 'sushi', name: 'Sushi', icon: 'fish' },
  { id: 'salad', name: 'Salad', icon: 'food-apple' },
  { id: 'dessert', name: 'Dessert', icon: 'cake' },
  { id: 'drinks', name: 'Drinks', icon: 'cup' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' }}
          style={[styles.hero, { paddingTop: insets.top }]}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Delicious Food Delivered</Text>
            <Text style={styles.heroSubtitle}>Order from your favorite restaurants</Text>
            <TouchableOpacity 
              style={styles.orderButton}
              onPress={() => router.push('/restaurant')}
            >
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push({
                  pathname: '/restaurant',
                  params: { cuisine: category.name }
                })}
              >
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons name={category.icon} size={32} color={Colors.light.tint} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Restaurants Section */}
        <View style={[styles.section, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsContainer}
          >
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantDetails}>
                    <View style={styles.ratingContainer}>
                      <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.rating}>{restaurant.rating}</Text>
                    </View>
                    <Text style={styles.restaurantType}>
                      {restaurant.cuisine} • {restaurant.priceLevel}
                    </Text>
                  </View>
                  <Text style={styles.deliveryTime}>{restaurant.deliveryTime}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    height: 300,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  orderButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 30,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantsContainer: {
    paddingRight: 20,
  },
  restaurantCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantType: {
    fontSize: 14,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
}); 