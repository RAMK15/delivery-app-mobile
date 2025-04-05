import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I track my order?",
    answer: "You can track your order in real-time by going to 'Order History' in your profile and selecting the active order. You'll see the current status and estimated delivery time."
  },
  {
    question: "What if I need to cancel my order?",
    answer: "You can cancel your order within 5 minutes of placing it. Go to 'Order History', select the order, and tap the 'Cancel Order' button. After 5 minutes, please contact support for assistance."
  },
  {
    question: "How do I change my delivery address?",
    answer: "You can update your delivery address before placing an order. Go to 'Saved Addresses' in your profile to add, edit, or remove addresses."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards, digital wallets (Apple Pay, Google Pay), and cash on delivery in select areas. Manage your payment methods in the 'Payment Methods' section."
  },
  {
    question: "How do I report an issue with my order?",
    answer: "If you have an issue with your order, please use the 'Report Issue' button on your order details page or contact our support team through the app."
  },
];

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@fooddelivery.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Help & Support</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
          <MaterialIcons name="email" size={24} color="#2ecc71" />
          <ThemedText style={styles.contactButtonText}>Email Support</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
          <MaterialIcons name="phone" size={24} color="#2ecc71" />
          <ThemedText style={styles.contactButtonText}>Call Support</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
          >
            <View style={styles.faqHeader}>
              <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
              <MaterialIcons
                name={expandedFaq === index ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="#666"
              />
            </View>
            {expandedFaq === index && (
              <ThemedText style={styles.faqAnswer}>{faq.answer}</ThemedText>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App Information</ThemedText>
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Version</ThemedText>
          <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
        </View>
        <TouchableOpacity style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Terms of Service</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Privacy Policy</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  contactButtonText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  faqItem: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
}); 