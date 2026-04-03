import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import AddExpenseScreen from './screens/AddExpenseScreen';
import ExpensesListScreen from './screens/ExpensesListScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BrandMark from './components/BrandMark';

const Tab = createBottomTabNavigator();

const tabIcons = {
  'Add Expense': 'add-circle',
  'Expenses List': 'list',
  Analytics: 'pie-chart',
  Settings: 'settings',
};

function Tabs() {
  const { loading } = useExpenses();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <BrandMark compact />
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8, color: theme.colors.text }}>Loading Spendy...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#8b9aa6',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 62 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name] || 'ellipse'} color={color} size={size} />
        ),
      })}
    >
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
    <SafeAreaProvider>
      <ExpenseProvider>
        <AppContainer />
      </ExpenseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    elevation: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: {
    borderRadius: 14,
    marginHorizontal: 4,
    marginTop: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
});
