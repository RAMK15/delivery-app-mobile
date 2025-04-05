import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface SearchResult {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
}

interface PopularCategory {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const restaurants: SearchResult[] = [
  {
    id: 1,
    name: 'Italian Bistro',
    cuisine: 'Italian',
    rating: 4.5,
    image: 'https://source.unsplash.com/random/800x400?restaurant,italian',
  },
  {
    id: 2,
    name: 'Sushi Master',
    cuisine: 'Japanese',
    rating: 4.8,
    image: 'https://source.unsplash.com/random/800x400?restaurant,japanese',
  },
  {
    id: 3,
    name: 'Burger House',
    cuisine: 'American',
    rating: 4.2,
    image: 'https://source.unsplash.com/random/800x400?restaurant,burger',
  },
  {
    id: 4,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.3,
    image: 'https://source.unsplash.com/random/800x400?restaurant,mexican',
  },
  {
    id: 5,
    name: 'Curry House',
    cuisine: 'Indian',
    rating: 4.6,
    image: 'https://source.unsplash.com/random/800x400?restaurant,indian',
  },
  {
    id: 6,
    name: 'Thai Spice',
    cuisine: 'Thai',
    rating: 4.4,
    image: 'https://source.unsplash.com/random/800x400?restaurant,thai',
  },
];

const popularCategories: PopularCategory[] = [
  { id: '1', name: 'Italian', icon: 'local-pizza' },
  { id: '2', name: 'Japanese', icon: 'ramen-dining' },
  { id: '3', name: 'American', icon: 'lunch-dining' },
  { id: '4', name: 'Mexican', icon: 'restaurant' },
  { id: '5', name: 'Indian', icon: 'restaurant' },
  { id: '6', name: 'Thai', icon: 'restaurant' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const updatedSearches = [
        query,
        ...recentSearches.filter(item => item !== query)
      ].slice(0, 5);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter restaurants based on search query
      const filteredResults = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
      if (query.trim().length > 0) {
        saveRecentSearch(query);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    router.push(`/restaurants?cuisine=${category}`);
  };

  const handleResultPress = (id: number) => {
    router.push(`/restaurants/${id}`);
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultPress(item.id)}
    >
      <View style={styles.resultContent}>
        <ThemedText style={styles.resultName}>{item.name}</ThemedText>
        <ThemedText style={styles.resultCuisine}>{item.cuisine}</ThemedText>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <ThemedText style={styles.rating}>{item.rating}</ThemedText>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleSearch(item)}
    >
      <MaterialIcons name="history" size={20} color="#666" />
      <ThemedText style={styles.recentText}>{item}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or cuisines..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={styles.clearButton}
          >
            <MaterialIcons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2ecc71" />
        </View>
      ) : searchQuery.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No results found</ThemedText>
            </View>
          }
        />
      ) : (
        <ScrollView style={styles.content}>
          {recentSearches.length > 0 && (
            <>
              <ThemedText style={styles.sectionTitle}>Recent Searches</ThemedText>
              <FlatList
                data={recentSearches}
                renderItem={renderRecentSearch}
                keyExtractor={(item) => item}
                scrollEnabled={false}
              />
            </>
          )}

          <ThemedText style={styles.sectionTitle}>Popular Categories</ThemedText>
          <View style={styles.categoriesContainer}>
            {popularCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.name)}
              >
                <MaterialIcons name={category.icon} size={32} color="#2ecc71" />
                <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  categoryItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  categoryName: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentText: {
    marginLeft: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 