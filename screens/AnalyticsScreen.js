import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getMonthlyExpenses } from '../database';
import { calculateMonthlyAnalytics } from '../utils/analytics';
import { exportExpensesToExcel } from '../utils/exportExcel';
import { getMonthKey, toMonthLabel } from '../utils/date';

const colors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#58595b', '#8549ba'];

export default function AnalyticsScreen() {
  const [monthKey, setMonthKey] = useState(getMonthKey());
  const [expenses, setExpenses] = useState([]);

  const load = async () => setExpenses(await getMonthlyExpenses(monthKey));
  useEffect(() => { load(); }, [monthKey]);

  const analytics = useMemo(() => calculateMonthlyAnalytics(expenses), [expenses]);

  const pieData = Object.entries(analytics.categoryTotals).map(([name, amount], i) => ({
    name,
    amount,
    color: colors[i % colors.length],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  const weeklyLabels = analytics.weeklyTotals.map((w) => w.label);
  const weeklyData = analytics.weeklyTotals.map((w) => w.amount);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monthly Analytics</Text>
      <TextInput style={styles.input} value={monthKey} onChangeText={setMonthKey} placeholder="YYYY-MM" />
      <Text style={styles.subtitle}>{toMonthLabel(monthKey)} • Total ₹{analytics.total.toFixed(2)}</Text>

      {pieData.length > 0 ? (
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 24}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          chartConfig={chartConfig}
          absolute
        />
      ) : (
        <Text style={styles.muted}>No data for this month.</Text>
      )}

      <BarChart
        data={{ labels: weeklyLabels, datasets: [{ data: weeklyData.length ? weeklyData : [0, 0, 0, 0, 0] }] }}
        width={Dimensions.get('window').width - 24}
        height={240}
        fromZero
        yAxisLabel="₹"
        chartConfig={chartConfig}
        style={styles.chart}
      />

      <Button
        title="Export Month to Excel"
        onPress={async () => {
          const filePath = await exportExpensesToExcel(monthKey, expenses);
          Alert.alert('Exported', `File saved: ${filePath}`);
        }}
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
  labelColor: () => '#333',
};

const styles = StyleSheet.create({
  container: { padding: 12, paddingBottom: 30 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { marginBottom: 12, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chart: { borderRadius: 12, marginBottom: 12 },
  muted: { color: '#666', marginVertical: 8 },
});
