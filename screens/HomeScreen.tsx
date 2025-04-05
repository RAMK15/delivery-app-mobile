import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Restaurant: { restaurantId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Restaurant'>;

interface Restaurant {
  id: number;
  name: string;
  image: string;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50',
  },
  {
    id: 2,
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
  },
  {
    id: 3,
    name: 'Sushi World',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
  },
];

export const HomeScreen = () => {
  console.warn('HomeScreen rendered');
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => {
        console.warn('Restaurant selected:', item.name);
        navigation.navigate('Restaurant', { restaurantId: item.id });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <Text style={styles.restaurantName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  restaurantCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
}); 