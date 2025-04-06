import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginStep = 'phone' | 'otp';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [currentStep, setCurrentStep] = useState<LoginStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call to send OTP
      //for local dev - ifconfig | grep "inet " | grep -v 127.0.0.1
      const response = await fetch('http://192.168.29.133:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            countryCode: '+91',
        }),
      });

      if (!response.ok) {
          throw new Error('Failed to send OTP');
      }
      setCurrentStep('otp');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Simulate API call to verify OTP
      const response = await fetch('http://192.168.29.133:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            countryCode: '+91',
            otp: otp,
        }),
        });

        if (!response.ok) {
            throw new Error('Failed to verify OTP');
        }
      
      // Set auth token on successful verification
      await AsyncStorage.setItem('authToken', 'dummy-auth-token');
      
      router.replace('/(tabs)');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('OTP resent successfully');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <MaterialIcons name="local-dining" size={64} color="#2ecc71" />
        <ThemedText style={styles.title}>Welcome to FoodDelivery</ThemedText>
        <ThemedText style={styles.subtitle}>
          {currentStep === 'phone'
            ? 'Enter your phone number to continue'
            : 'Enter the OTP sent to your phone'}
        </ThemedText>

        {currentStep === 'phone' ? (
          <View style={styles.inputContainer}>
            <View style={styles.phoneInput}>
              <ThemedText style={styles.countryCode}>+91</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={text => {
                  setPhoneNumber(text.replace(/[^0-9]/g, ''));
                  setError('');
                }}
                maxLength={10}
              />
            </View>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handlePhoneSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Continue</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={text => {
                setOtp(text.replace(/[^0-9]/g, ''));
                setError('');
              }}
              maxLength={6}
              placeholderTextColor="#999"
              secureTextEntry={false}
              textContentType="oneTimeCode"
            />
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleOtpSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Verify OTP</ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={isLoading}
            >
              <ThemedText style={styles.resendText}>Resend OTP</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCurrentStep('phone');
                setError('');
              }}
            >
              <ThemedText style={styles.backText}>Change Phone Number</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#000000',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 8,
    height: 60,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendText: {
    color: '#2ecc71',
    fontSize: 14,
  },
  backButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
}); 