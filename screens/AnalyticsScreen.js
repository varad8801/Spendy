import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { PieChart, BarChart } from 'react-native-chart-kit';
import * as Sharing from 'expo-sharing';
import { getMonthlyExpenses } from '../database';
import { calculateMonthlyAnalytics } from '../utils/analytics';
import BrandMark from '../components/BrandMark';
import { exportExpensesToExcel } from '../utils/exportExcel';
import { getMonthKey, toMonthLabel } from '../utils/date';

const colors = ['#0f766e', '#f97316', '#ec4899', '#2563eb', '#84cc16', '#7c3aed', '#14b8a6'];
const chartWidth = Dimensions.get('window').width - 28;

export default function AnalyticsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [monthKey, setMonthKey] = useState(getMonthKey());
  const [expenses, setExpenses] = useState([]);

  const load = async () => setExpenses(await getMonthlyExpenses(monthKey));
  useEffect(() => { load(); }, [monthKey]);

  const analytics = useMemo(() => calculateMonthlyAnalytics(expenses), [expenses]);
  const average = expenses.length ? analytics.total / expenses.length : 0;

  const pieData = Object.entries(analytics.categoryTotals).map(([name, amount], i) => ({
    name,
    amount,
    color: colors[i % colors.length],
    legendFontColor: '#334155',
    legendFontSize: 12,
  }));

  const weeklyLabels = analytics.weeklyTotals.map((w) => w.label);
  const weeklyData = analytics.weeklyTotals.map((w) => w.amount);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 18 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <BrandMark light />
        <Text style={styles.kicker}>See the patterns</Text>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>{toMonthLabel(monthKey)} • Total ₹{analytics.total.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <MetricCard label="Spent" value={`₹${analytics.total.toFixed(0)}`} tone="teal" />
        <MetricCard label="Entries" value={String(expenses.length)} tone="amber" />
        <MetricCard label="Avg" value={`₹${average.toFixed(0)}`} tone="violet" />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Month key</Text>
        <TextInput
          style={styles.input}
          value={monthKey}
          onChangeText={setMonthKey}
          placeholder="YYYY-MM"
          placeholderTextColor="#7b8a95"
        />
        <Text style={styles.helper}>Change the month to load a different view.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Category split</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="8"
            chartConfig={chartConfig}
            absolute
          />
        ) : (
          <Text style={styles.muted}>No data for this month.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly trend</Text>
        <BarChart
          data={{ labels: weeklyLabels, datasets: [{ data: weeklyData.length ? weeklyData : [0, 0, 0, 0, 0] }] }}
          width={chartWidth}
          height={240}
          fromZero
          yAxisLabel="₹"
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <TouchableOpacity
        style={styles.exportButton}
        onPress={async () => {
          try {
            const filePath = await exportExpensesToExcel(monthKey, expenses);
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
              await Sharing.shareAsync(filePath, {
                mimeType: 'text/csv',
                dialogTitle: 'Export expenses',
              });
            }
            Alert.alert('Exported', `Saved locally as:\n${filePath}`);
          } catch (error) {
            Alert.alert('Export failed', error?.message || 'Could not export the file.');
          }
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.exportButtonText}>Export CSV</Text>
      </TouchableOpacity>

      <Text style={styles.footerHint}>Spreadsheet exports now use plain JS CSV generation so Expo Go can share them reliably.</Text>
    </ScrollView>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <View style={[styles.metricCard, styles[`metric${tone}`]]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
  labelColor: () => '#334155',
  propsForBackgroundLines: {
    stroke: '#e2e8f0',
  },
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingTop: 10,
    backgroundColor: '#eef7f4',
  },
  hero: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    backgroundColor: '#0f766e',
  },
  kicker: {
    color: '#c9fff6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { marginTop: 8, color: '#d3fffa', lineHeight: 20 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  metricLabel: { fontSize: 12, fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
  metricValue: { marginTop: 6, fontSize: 20, fontWeight: '900', color: '#0f172a' },
  metricteal: { borderTopWidth: 4, borderTopColor: '#0f766e' },
  metricamber: { borderTopWidth: 4, borderTopColor: '#f97316' },
  metricviolet: { borderTopWidth: 4, borderTopColor: '#7c3aed' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#dbe4ea',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f8fbfc',
    color: '#0f172a',
  },
  helper: { marginTop: 8, color: '#64748b' },
  muted: { color: '#64748b' },
  chart: { borderRadius: 18 },
  exportButton: {
    backgroundColor: '#102a43',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  exportButtonText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  footerHint: { color: '#64748b', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
