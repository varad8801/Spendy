import React, { useMemo, useState } from 'react';
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { PickerField } from '../components/PickerField';
import { CATEGORIES, PAYMENT_MODES } from '../utils/constants';

const allCategories = ['All', ...CATEGORIES];

export default function ExpensesListScreen() {
  const { expenses, filters, applyFilters, removeExpense, editExpense } = useExpenses();
  const [editing, setEditing] = useState(null);

  const total = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount), 0), [expenses]);

  const confirmDelete = (id) => {
    Alert.alert('Delete', 'Delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeExpense(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.subtitle}>Total (filtered): ₹{total.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Filter by date YYYY-MM-DD"
        value={filters.date}
        onChangeText={(date) => applyFilters({ ...filters, date })}
      />
      <PickerField
        label="Category Filter"
        value={filters.category}
        onValueChange={(category) => applyFilters({ ...filters, category })}
        options={allCategories}
      />
      <TextInput
        style={styles.input}
        placeholder="Search notes/category"
        value={filters.search}
        onChangeText={(search) => applyFilters({ ...filters, search })}
      />

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.amount}>₹{Number(item.amount).toFixed(2)}</Text>
              <Text>{item.category} • {item.payment_mode}</Text>
              <Text style={styles.muted}>{item.date}</Text>
              {item.notes ? <Text style={styles.muted}>{item.notes}</Text> : null}
            </View>
            <View style={styles.actions}>
              <Button title="Edit" onPress={() => setEditing({ ...item, paymentMode: item.payment_mode })} />
              <Button title="Delete" color="#d9534f" onPress={() => confirmDelete(item.id)} />
            </View>
          </View>
        )}
      />

      <EditModal editing={editing} onClose={() => setEditing(null)} onSave={editExpense} />
    </View>
  );
}

function EditModal({ editing, onClose, onSave }) {
  const [draft, setDraft] = useState(editing);
  React.useEffect(() => setDraft(editing), [editing]);

  if (!draft) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Edit Expense</Text>
          <TextInput style={styles.input} value={String(draft.amount)} keyboardType="decimal-pad" onChangeText={(v) => setDraft({ ...draft, amount: v })} />
          <TextInput style={styles.input} value={draft.category} onChangeText={(v) => setDraft({ ...draft, category: v })} />
          <TextInput style={styles.input} value={draft.notes || ''} onChangeText={(v) => setDraft({ ...draft, notes: v })} />
          <TextInput style={styles.input} value={draft.date} onChangeText={(v) => setDraft({ ...draft, date: v })} />
          <PickerField label="Payment" value={draft.paymentMode} onValueChange={(paymentMode) => setDraft({ ...draft, paymentMode })} options={PAYMENT_MODES} />
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onClose}><Text>Cancel</Text></TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimary]}
              onPress={async () => {
                await onSave(draft.id, {
                  amount: Number(draft.amount),
                  category: draft.category,
                  notes: draft.notes,
                  date: draft.date,
                  paymentMode: draft.paymentMode,
                });
                onClose();
              }}
            >
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { marginBottom: 8, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 8,
  },
  amount: { fontSize: 18, fontWeight: '700' },
  muted: { color: '#666' },
  actions: { justifyContent: 'space-between' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 14 },
  modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#eee' },
  btnPrimary: { backgroundColor: '#222' },
});
