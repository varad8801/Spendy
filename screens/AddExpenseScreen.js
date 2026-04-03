import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useExpenses } from '../context/ExpenseContext';
import { FormField } from '../components/FormField';
import { PickerField } from '../components/PickerField';
import BrandMark from '../components/BrandMark';
import { CATEGORIES, PAYMENT_MODES } from '../utils/constants';
import { formatDateInput } from '../utils/date';

export default function AddExpenseScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { createExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(formatDateInput());
  const [paymentMode, setPaymentMode] = useState('UPI');

  const clearForm = () => {
    setAmount('');
    setCategory('Food');
    setCustomCategory('');
    setNotes('');
    setDate(formatDateInput());
    setPaymentMode('UPI');
  };

  const onSave = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Validation', 'Amount is required and should be greater than 0.');
      return;
    }
    const finalCategory = category === 'Other' ? customCategory.trim() : category;
    if (!finalCategory) {
      Alert.alert('Validation', 'Please enter a category.');
      return;
    }

    await createExpense({
      amount: Number(amount),
      category: finalCategory,
      notes,
      date,
      paymentMode,
    });
    Alert.alert('Saved', 'Expense added successfully.');
    clearForm();
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 18 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <BrandMark light />
        <Text style={styles.kicker}>Spend smarter</Text>
        <Text style={styles.title}>Quick Add Expense</Text>
        <Text style={styles.subtitle}>Log money outflow in a few taps and keep the month honest.</Text>
      </View>

      <View style={styles.card}>
        <FormField label="Amount *" value={amount} keyboardType="decimal-pad" onChangeText={setAmount} placeholder="e.g. 250" />
        <PickerField label="Category *" value={category} onValueChange={setCategory} options={CATEGORIES} />
        {category === 'Other' && (
          <FormField label="Custom Category" value={customCategory} onChangeText={setCustomCategory} placeholder="Enter category" />
        )}
        <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional details" />
        <FormField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-04-02" />
        <PickerField label="Payment Mode" value={paymentMode} onValueChange={setPaymentMode} options={PAYMENT_MODES} />

        <TouchableOpacity style={styles.primaryButton} onPress={onSave} activeOpacity={0.9}>
          <Text style={styles.primaryButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#eef7f4',
  },
  hero: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    backgroundColor: '#0f766e',
  },
  kicker: {
    color: '#c9fff6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    marginTop: 8,
    color: '#d3fffa',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#0f766e',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
