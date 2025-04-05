import React from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import { Text } from '../../components/Themed';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or dishes..."
          placeholderTextColor="#666"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>Popular Searches</Text>
        {/* Add popular searches here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 