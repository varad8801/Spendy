import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { FormField } from '../components/FormField';
import { PickerField } from '../components/PickerField';
import { CATEGORIES, PAYMENT_MODES } from '../utils/constants';
import { formatDateInput } from '../utils/date';

export default function AddExpenseScreen() {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quick Add Expense</Text>
      <FormField label="Amount *" value={amount} keyboardType="decimal-pad" onChangeText={setAmount} placeholder="e.g. 250" />
      <PickerField label="Category *" value={category} onValueChange={setCategory} options={CATEGORIES} />
      {category === 'Other' && (
        <FormField label="Custom Category" value={customCategory} onChangeText={setCustomCategory} placeholder="Enter category" />
      )}
      <FormField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional details" />
      <FormField label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-04-02" />
      <PickerField label="Payment Mode" value={paymentMode} onValueChange={setPaymentMode} options={PAYMENT_MODES} />
      <View style={styles.btnRow}>
        <Button title="Save Expense" onPress={onSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  btnRow: { marginTop: 8 },
});
