import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const FormField = ({ label, ...inputProps }) => (
  <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#888" style={styles.input} {...inputProps} />
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
  input: {
    borderWidth: 1,
    borderColor: '#dbe4ea',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#fff',
    color: '#0f172a',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
});
