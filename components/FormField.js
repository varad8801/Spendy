import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export const FormField = ({ label, ...inputProps }) => (
  <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>
    <TextInput placeholderTextColor="#888" style={styles.input} {...inputProps} />
  </View>
);

const styles = StyleSheet.create({
  group: { marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});
