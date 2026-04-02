import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addExpense,
  deleteExpense,
  getExpenses,
  initDatabase,
  seedSampleData,
  setSetting,
  getSetting,
  updateExpense,
} from '../database';
import { disableDailyReminder, scheduleDailyReminder } from '../utils/notifications';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', category: 'All', search: '' });
  const [settings, setSettings] = useState({ reminderEnabled: true, reminderTime: '21:00' });

  const loadExpenses = async (nextFilters = filters) => {
    const rows = await getExpenses(nextFilters);
    setExpenses(rows);
  };

  const bootstrap = async () => {
    setLoading(true);
    await initDatabase();
    await seedSampleData();
    const reminderEnabled = (await getSetting('reminder_enabled')) !== 'false';
    const reminderTime = (await getSetting('reminder_time')) || '21:00';
    setSettings({ reminderEnabled, reminderTime });
    await loadExpenses();
    if (reminderEnabled) await scheduleDailyReminder(reminderTime);
    setLoading(false);
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const applyFilters = async (next) => {
    setFilters(next);
    await loadExpenses(next);
  };

  const createExpense = async (payload) => {
    await addExpense(payload);
    await loadExpenses();
  };

  const editExpense = async (id, payload) => {
    await updateExpense(id, payload);
    await loadExpenses(filters);
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    await loadExpenses(filters);
  };

  const updateReminder = async ({ enabled, time }) => {
    const resolvedEnabled = enabled ?? settings.reminderEnabled;
    const resolvedTime = time ?? settings.reminderTime;

    await setSetting('reminder_enabled', String(resolvedEnabled));
    await setSetting('reminder_time', resolvedTime);

    if (resolvedEnabled) {
      await scheduleDailyReminder(resolvedTime);
    } else {
      await disableDailyReminder();
    }

    setSettings({ reminderEnabled: resolvedEnabled, reminderTime: resolvedTime });
  };

  return (
    <ExpenseContext.Provider
      value={{
        loading,
        expenses,
        filters,
        settings,
        applyFilters,
        createExpense,
        editExpense,
        removeExpense,
        updateReminder,
        reload: loadExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside ExpenseProvider');
  return ctx;
};
