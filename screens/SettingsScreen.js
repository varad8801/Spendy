import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useExpenses } from '../context/ExpenseContext';
import BrandMark from '../components/BrandMark';

const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export default function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { settings, updateReminder } = useExpenses();
  const [draftTime, setDraftTime] = useState(settings.reminderTime);

  useEffect(() => {
    setDraftTime(settings.reminderTime);
  }, [settings.reminderTime]);

  const saveTime = async () => {
    if (!isValidTime(draftTime)) {
      Alert.alert('Invalid time', 'Use 24h format HH:MM (example: 21:00).');
      return;
    }
    await updateReminder({ time: draftTime });
    Alert.alert('Saved', 'Reminder time updated.');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 18 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <BrandMark light />
        <Text style={styles.kicker}>Tidy routines</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Keep reminders and notification timing in sync with your day.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.label}>Daily reminder</Text>
            <Text style={styles.hint}>Get nudged to log expenses every day.</Text>
          </View>
          <Switch
            value={settings.reminderEnabled}
            onValueChange={(v) => updateReminder({ enabled: v })}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Reminder time (24h HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={draftTime}
          onChangeText={setDraftTime}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="21:00"
          placeholderTextColor="#7b8a95"
        />
        <TouchableOpacity style={styles.button} onPress={saveTime} activeOpacity={0.9}>
          <Text style={styles.buttonText}>Save reminder time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSoft}>
        <Text style={styles.note}>Default reminder message:</Text>
        <Text style={styles.noteBody}>Don't forget to log your expenses today!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, paddingTop: 10, backgroundColor: '#eef7f4' },
  hero: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#7c3aed',
  },
  kicker: {
    color: '#f3e8ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { marginTop: 8, color: '#ede9fe', lineHeight: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardSoft: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  label: { fontSize: 15, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  hint: { color: '#64748b', lineHeight: 18 },
  input: {
    borderWidth: 1,
    borderColor: '#dbe4ea',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f8fbfc',
    color: '#0f172a',
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  note: { color: '#64748b', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 6 },
  noteBody: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
});
