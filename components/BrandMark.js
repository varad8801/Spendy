import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BrandMark({ light = false, compact = false }) {
  const iconBg = light ? 'rgba(255,255,255,0.18)' : '#e6fffb';
  const iconColor = light ? '#ffffff' : '#0f766e';
  const titleColor = light ? '#ffffff' : '#0f172a';
  const subtitleColor = light ? '#d3fffa' : '#64748b';

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={[styles.logo, compact && styles.logoCompact, { backgroundColor: iconBg }]}>
        <Ionicons name="wallet" size={compact ? 14 : 16} color={iconColor} />
      </View>
      <View>
        <Text style={[styles.title, compact && styles.titleCompact, { color: titleColor }]}>Spendy</Text>
        {!compact ? <Text style={[styles.subtitle, { color: subtitleColor }]}>Expense tracker</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  rowCompact: {
    marginBottom: 0,
    gap: 8,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCompact: {
    width: 28,
    height: 28,
    borderRadius: 9,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  titleCompact: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
  },
});
