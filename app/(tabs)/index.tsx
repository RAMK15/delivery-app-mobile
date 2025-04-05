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
  { id: 1, name: 'Pizza', icon: 'local-pizza' as const, cuisine: 'Italian' },
  { id: 2, name: 'Burger', icon: 'fastfood' as const, cuisine: 'American' },
  { id: 3, name: 'Sushi', icon: 'restaurant' as const, cuisine: 'Japanese' },
  { id: 4, name: 'Salad', icon: 'eco' as const, cuisine: 'Healthy' },
  { id: 5, name: 'Dessert', icon: 'icecream' as const, cuisine: 'Dessert' },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (cuisine: string) => {
    setSelectedCategory(cuisine);
    router.push({
      pathname: '/restaurants',
      params: { cuisine }
    });
  };

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
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => router.push('/restaurants')}
          >
            <Text style={styles.heroButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.cuisine && styles.selectedCategory,
              ]}
              onPress={() => handleCategoryPress(category.cuisine)}
            >
              <View style={styles.categoryIcon}>
                <MaterialIcons 
                  name={category.icon} 
                  size={24} 
                  color={selectedCategory === category.cuisine ? '#fff' : '#FF6B6B'} 
                />
              </View>
              <Text 
                style={[
                  styles.categoryName,
                  selectedCategory === category.cuisine && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <Image
                source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{restaurant.rating}</Text>
                </View>
                <Text style={styles.restaurantDetails}>
                  {restaurant.cuisine} • {restaurant.deliveryTime}
                </Text>
              </View>
            </TouchableOpacity>
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
  selectedCategory: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    padding: 10,
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
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
  },
  restaurantDetails: {
    fontSize: 14,
    color: '#666',
  },
}); 