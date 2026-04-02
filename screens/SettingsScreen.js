import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useExpenses } from '../context/ExpenseContext';

const isValidTime = (value) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export default function SettingsScreen() {
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
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Daily reminder</Text>
        <Switch
          value={settings.reminderEnabled}
          onValueChange={(v) => updateReminder({ enabled: v })}
        />
      </View>

      <Text style={styles.label}>Reminder time (24h HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={draftTime}
        onChangeText={setDraftTime}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Save reminder time" onPress={saveTime} />

      <Text style={styles.hint}>Default reminder message: "Don't forget to log your expenses today!"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  hint: { color: '#666', marginTop: 16 },
});
