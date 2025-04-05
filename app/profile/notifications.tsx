import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    specialOffers: true,
    deliveryStatus: true,
    emailNotifications: false,
    newRestaurants: true,
    weeklyDigest: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const NotificationItem = ({ 
    title, 
    description, 
    settingKey 
  }: { 
    title: string; 
    description: string; 
    settingKey: keyof typeof settings;
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationInfo}>
        <ThemedText style={styles.notificationTitle}>{title}</ThemedText>
        <ThemedText style={styles.notificationDescription}>{description}</ThemedText>
      </View>
      <Switch
        value={settings[settingKey]}
        onValueChange={() => toggleSetting(settingKey)}
        trackColor={{ false: '#ddd', true: '#2ecc71' }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Notifications</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Order Updates</ThemedText>
          <NotificationItem
            title="Order Status"
            description="Get updates about your order status"
            settingKey="orderUpdates"
          />
          <NotificationItem
            title="Delivery Status"
            description="Track your order in real-time"
            settingKey="deliveryStatus"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Promotions</ThemedText>
          <NotificationItem
            title="Special Offers"
            description="Receive notifications about deals and discounts"
            settingKey="specialOffers"
          />
          <NotificationItem
            title="New Restaurants"
            description="Be the first to know about new restaurants"
            settingKey="newRestaurants"
          />
        </View>

        <View style={[styles.section, { marginBottom: insets.bottom + 15 }]}>
          <ThemedText style={styles.sectionTitle}>Email Preferences</ThemedText>
          <NotificationItem
            title="Email Notifications"
            description="Receive order confirmations and updates via email"
            settingKey="emailNotifications"
          />
          <NotificationItem
            title="Weekly Digest"
            description="Get a weekly summary of new offers and restaurants"
            settingKey="weeklyDigest"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#666',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 15,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 