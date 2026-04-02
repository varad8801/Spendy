import React from 'react';
import { ActivityIndicator, Text, View, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpensesListScreen from './screens/ExpensesListScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function Tabs() {
  const { loading } = useExpenses();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: theme.colors.text }}>Loading Spendy...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Add Expense" component={AddExpenseScreen} />
      <Tab.Screen name="Expenses List" component={ExpensesListScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppContainer() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <AppContainer />
    </ExpenseProvider>
  );
}
