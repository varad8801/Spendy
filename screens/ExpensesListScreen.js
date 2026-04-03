import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useExpenses } from '../context/ExpenseContext';
import { PickerField } from '../components/PickerField';
import BrandMark from '../components/BrandMark';
import { CATEGORIES, PAYMENT_MODES } from '../utils/constants';

const allCategories = ['All', ...CATEGORIES];

export default function ExpensesListScreen() {
  const tabBarHeight = useBottomTabBarHeight();
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
      <View style={styles.hero}>
        <BrandMark light />
        <Text style={styles.kicker}>Track the trail</Text>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>Live filtered total: ₹{total.toFixed(2)}</Text>
      </View>

      <View style={styles.filtersCard}>
        <TextInput
          style={styles.input}
          placeholder="Filter by date YYYY-MM-DD"
          placeholderTextColor="#7b8a95"
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
          placeholderTextColor="#7b8a95"
          value={filters.search}
          onChangeText={(search) => applyFilters({ ...filters, search })}
        />
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 16 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemAccent} />
            <View style={{ flex: 1 }}>
              <View style={styles.itemTopRow}>
                <Text style={styles.amount}>₹{Number(item.amount).toFixed(2)}</Text>
                <Text style={styles.modePill}>{item.payment_mode}</Text>
              </View>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.muted}>{item.date}</Text>
              {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => setEditing({ ...item, paymentMode: item.payment_mode })}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => confirmDelete(item.id)}>
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
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
          <Text style={styles.modalTitle}>Edit Expense</Text>
          <TextInput style={styles.input} value={String(draft.amount)} keyboardType="decimal-pad" onChangeText={(v) => setDraft({ ...draft, amount: v })} />
          <TextInput style={styles.input} value={draft.category} onChangeText={(v) => setDraft({ ...draft, category: v })} />
          <TextInput style={styles.input} value={draft.notes || ''} onChangeText={(v) => setDraft({ ...draft, notes: v })} />
          <TextInput style={styles.input} value={draft.date} onChangeText={(v) => setDraft({ ...draft, date: v })} />
          <PickerField label="Payment" value={draft.paymentMode} onValueChange={(paymentMode) => setDraft({ ...draft, paymentMode })} options={PAYMENT_MODES} />
          <View style={styles.row}>
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
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
              <Text style={styles.btnPrimaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, paddingTop: 10, backgroundColor: '#f5f9fb' },
  hero: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#102a43',
  },
  kicker: {
    color: '#9be7ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  subtitle: { marginTop: 6, color: '#dbeafe' },
  filtersCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dbe4ea',
    borderRadius: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#fff',
    color: '#0f172a',
  },
  item: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  itemAccent: {
    width: 8,
    borderRadius: 999,
    backgroundColor: '#0f766e',
    marginRight: 12,
  },
  itemTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amount: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  category: { marginTop: 3, fontSize: 15, fontWeight: '700', color: '#0f766e' },
  muted: { color: '#6b7280', marginTop: 4 },
  notes: { color: '#334155', marginTop: 6, lineHeight: 18 },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontWeight: '800',
    overflow: 'hidden',
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  editButton: { backgroundColor: '#e6fffb' },
  deleteButton: { backgroundColor: '#ffe4e6' },
  actionText: { fontWeight: '900', color: '#0f172a' },
  deleteText: { color: '#be123c' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.58)', justifyContent: 'center', padding: 14 },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  btn: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#e2e8f0' },
  btnText: { fontWeight: '900', color: '#0f172a' },
  btnPrimary: { backgroundColor: '#0f766e' },
  btnPrimaryText: { fontWeight: '900', color: '#fff' },
  listContent: { paddingBottom: 24 },
});
