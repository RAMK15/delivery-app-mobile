import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
};

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

interface OrderItem {
  id: number;
  date: string;
  restaurant: string;
  items: string[];
  total: number;
  status: string;
}

const user: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, City, State 12345',
  avatar: 'https://source.unsplash.com/random/200x200?portrait',
};

const orderHistory: OrderItem[] = [
  {
    id: 1,
    date: '2024-03-15',
    restaurant: 'Italian Bistro',
    items: ['Margherita Pizza', 'Garlic Bread'],
    total: 25.98,
    status: 'Delivered',
  },
  {
    id: 2,
    date: '2024-03-10',
    restaurant: 'Sushi Master',
    items: ['California Roll', 'Miso Soup'],
    total: 18.97,
    status: 'Delivered',
  },
  {
    id: 3,
    date: '2024-03-05',
    restaurant: 'Burger House',
    items: ['Classic Burger', 'French Fries'],
    total: 15.98,
    status: 'Delivered',
  },
];

export default function ProfileScreen() {
  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', title: 'Personal Information', route: '/profile/personal-info' },
        { icon: 'notifications', title: 'Notifications', route: '/profile/notifications' },
        { icon: 'payment', title: 'Payment Methods', route: '/profile/payment' },
      ]
    },
    {
      title: 'Orders & Addresses',
      items: [
        { icon: 'history', title: 'Order History', route: '/profile/orders' },
        { icon: 'location-on', title: 'Saved Addresses', route: '/profile/addresses' },
      ]
    },
    {
      title: 'Support & Settings',
      items: [
        { icon: 'help', title: 'Help & Support', route: '/profile/help' },
        { icon: 'settings', title: 'Settings', route: '/profile/settings' },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar}
        />
        <ThemedText style={styles.name}>{user.name}</ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>
      </View>

      {sections.map((section, index) => (
        <View key={section.title} style={[styles.section, index > 0 && styles.sectionMargin]}>
          <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                itemIndex === section.items.length - 1 && styles.menuItemLast
              ]}
              onPress={() => router.push(item.route)}
            >
              <MaterialIcons name={item.icon} size={24} color="#2ecc71" />
              <ThemedText style={styles.menuText}>{item.title}</ThemedText>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionMargin: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    padding: 15,
    paddingBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
}); 