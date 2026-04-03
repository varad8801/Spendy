import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const PickerField = ({ label, value, onValueChange, options }) => (
  <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pickerWrap}>
      <Picker selectedValue={value} onValueChange={onValueChange}>
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </View>
  </View>
);

const styles = StyleSheet.create({
  group: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 8,
    color: '#0f172a',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#dbe4ea',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
});
