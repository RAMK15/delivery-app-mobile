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
  const menuItems: MenuItem[] = [
    { icon: 'person-outline', title: 'Personal Information' },
    { icon: 'location-outline', title: 'Saved Addresses' },
    { icon: 'card-outline', title: 'Payment Methods' },
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'settings-outline', title: 'Settings' },
    { icon: 'help-circle-outline', title: 'Help & Support' },
  ];

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <ThemedText style={styles.restaurantName}>{item.restaurant}</ThemedText>
        <ThemedText style={styles.orderStatus}>{item.status}</ThemedText>
      </View>
      <ThemedText style={styles.orderDate}>{item.date}</ThemedText>
      <ThemedText style={styles.orderItems}>{item.items.join(', ')}</ThemedText>
      <View style={styles.orderFooter}>
        <ThemedText style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</ThemedText>
        <TouchableOpacity style={styles.reorderButton}>
          <ThemedText style={styles.reorderButtonText}>Reorder</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image
            style={styles.avatar}
            source={{ uri: user.avatar }}
          />
          <View>
            <ThemedText style={styles.name}>{user.name}</ThemedText>
            <ThemedText style={styles.email}>{user.email}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color="#666" />
              <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ordersContainer}>
        <ThemedText style={styles.sectionTitle}>Past Orders</ThemedText>
        <FlatList
          data={orderHistory}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  ordersContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    color: '#2ecc71',
  },
  orderDate: {
    color: '#666',
    marginBottom: 8,
  },
  orderItems: {
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reorderButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  reorderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 