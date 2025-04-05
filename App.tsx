import React from 'react';
import { CartProvider } from './contexts/CartContext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <CartProvider>
      <Slot />
    </CartProvider>
  );
} 