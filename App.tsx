import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { CartProvider } from './contexts/CartContext';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<MainTabsParamList>();

export type MainTabsParamList = {
  Home: undefined;
  Cart: undefined;
};

type RootStackParamList = {
  MainTabs: undefined;
  Restaurant: { restaurantId: string };
};

type TabScreenOptions = {
  route: RouteProp<MainTabsParamList, keyof MainTabsParamList>;
  navigation: BottomTabNavigationProp<MainTabsParamList>;
};

function MainTabs() {
  console.log('Rendering MainTabs');
  return (
    <Tab.Navigator
      screenOptions={({ route, theme }) => {
        console.log('Current route:', route.name);
        return {
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            height: 60,
            backgroundColor: '#fff',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Cart') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else {
              iconName = 'help';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
} 