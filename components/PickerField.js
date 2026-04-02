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
  group: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 6 },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
