import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalInfoScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Personal Information</ThemedText>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <MaterialIcons name={isEditing ? "check" : "edit"} size={24} color="#2ecc71" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={user.name}
                onChangeText={(text) => setUser({ ...user, name: text })}
              />
            ) : (
              <ThemedText style={styles.value}>{user.name}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Email</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => setUser({ ...user, email: text })}
                keyboardType="email-address"
              />
            ) : (
              <ThemedText style={styles.value}>{user.email}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={user.phone}
                onChangeText={(text) => setUser({ ...user, phone: text })}
                keyboardType="phone-pad"
              />
            ) : (
              <ThemedText style={styles.value}>{user.phone}</ThemedText>
            )}
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Address</ThemedText>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(text) => setUser({ ...user, address: text })}
                multiline
              />
            ) : (
              <ThemedText style={styles.value}>{user.address}</ThemedText>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={[styles.saveButton, { marginBottom: insets.bottom + 15 }]} 
            onPress={handleSave}
          >
            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
          </TouchableOpacity>
        )}
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
  editButton: {
    padding: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 