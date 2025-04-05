import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCart, CartItem } from '../../contexts/CartContext';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface RestaurantGroup {
  restaurant: string;
  items: CartItem[];
  subtotal: number;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem } = useCart();

  // Group items by restaurant
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: RestaurantGroup } = {};
    
    items.forEach(item => {
      if (!groups[item.restaurant]) {
        groups[item.restaurant] = {
          restaurant: item.restaurant,
          items: [],
          subtotal: 0
        };
      }
      groups[item.restaurant].items.push(item);
      groups[item.restaurant].subtotal += item.price * item.quantity;
    });

    return Object.values(groups);
  }, [items]);

  const total = groupedItems.reduce((sum, group) => sum + group.subtotal, 0);
  const hasMultipleRestaurants = groupedItems.length > 1;

  const handleCheckout = (restaurant?: string, subtotal?: number) => {
    if (restaurant) {
      // Single restaurant checkout
      console.log('Checking out for:', restaurant, 'Total:', subtotal);
      router.push({
        pathname: '/checkout',
        params: { restaurant }
      });
    } else {
      // Common checkout for all restaurants
      console.log('Checking out all restaurants, Total:', total);
      router.push('/checkout');
    }
  };

  const renderCartItem = (item: CartItem) => (
    <View key={`${item.id}-${item.restaurant}`} style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <ThemedText style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</ThemedText>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, -1, item.restaurant)}
        >
          <ThemedText style={styles.quantityButtonText}>-</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, 1, item.restaurant)}
        >
          <ThemedText style={styles.quantityButtonText}>+</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.id, item.restaurant)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText style={styles.title}>Cart</ThemedText>
      </View>

      <ScrollView style={styles.container}>
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
          </View>
        ) : (
          groupedItems.map((group, index) => (
            <View 
              key={group.restaurant} 
              style={[
                styles.restaurantGroup,
                index === groupedItems.length - 1 && { marginBottom: insets.bottom + 15 }
              ]}
            >
              <View style={styles.restaurantHeader}>
                <ThemedText style={styles.restaurantName}>{group.restaurant}</ThemedText>
                <ThemedText style={styles.subtotalText}>
                  Subtotal: ${group.subtotal.toFixed(2)}
                </ThemedText>
              </View>
              {group.items.map(renderCartItem)}
              {hasMultipleRestaurants && (
                <View style={styles.restaurantCheckout}>
                  <TouchableOpacity 
                    style={[styles.checkoutButton, styles.singleRestaurantButton]}
                    onPress={() => handleCheckout(group.restaurant, group.subtotal)}
                  >
                    <ThemedText style={styles.checkoutButtonText}>
                      Checkout {group.restaurant} (${group.subtotal.toFixed(2)})
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={[styles.totalContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Cart Total</ThemedText>
            <ThemedText style={styles.totalAmount}>${total.toFixed(2)}</ThemedText>
          </View>
          
          <TouchableOpacity 
            style={[styles.checkoutButton, styles.commonCheckoutButton]}
            onPress={() => handleCheckout()}
          >
            <ThemedText style={styles.checkoutButtonText}>
              {hasMultipleRestaurants 
                ? "Checkout All Restaurants"
                : `Checkout (${groupedItems[0]?.restaurant})`}
            </ThemedText>
          </TouchableOpacity>

          {hasMultipleRestaurants && (
            <View style={styles.totalInfo}>
              <MaterialIcons name="info-outline" size={16} color="#666" style={styles.infoIcon} />
              <ThemedText style={styles.totalInfoText}>
                You can checkout all restaurants together or individually
              </ThemedText>
            </View>
          )}
        </View>
      )}
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
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  restaurantGroup: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtotalText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  restaurantCheckout: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2ecc71',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#2ecc71',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 15,
    padding: 5,
  },
  totalContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  totalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 5,
  },
  totalInfoText: {
    fontSize: 14,
    color: '#666',
  },
  checkoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  singleRestaurantButton: {
    backgroundColor: '#34495e',
  },
  commonCheckoutButton: {
    backgroundColor: '#2ecc71',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 