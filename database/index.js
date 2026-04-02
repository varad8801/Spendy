import * as SQLite from 'expo-sqlite';

let db;

export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('spendy.db');
  }
  return db;
};

export const initDatabase = async () => {
  const database = await getDb();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      date TEXT NOT NULL,
      payment_mode TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
  await database.runAsync(
    'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)',
    ['reminder_enabled', 'true']
  );
  await database.runAsync(
    'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)',
    ['reminder_time', '21:00']
  );
};

export const addExpense = async ({ amount, category, notes = '', date, paymentMode }) => {
  const database = await getDb();
  return database.runAsync(
    `INSERT INTO expenses (amount, category, notes, date, payment_mode, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [amount, category, notes, date, paymentMode, new Date().toISOString()]
  );
};

export const updateExpense = async (id, { amount, category, notes = '', date, paymentMode }) => {
  const database = await getDb();
  return database.runAsync(
    `UPDATE expenses
     SET amount = ?, category = ?, notes = ?, date = ?, payment_mode = ?
     WHERE id = ?`,
    [amount, category, notes, date, paymentMode, id]
  );
};

export const deleteExpense = async (id) => {
  const database = await getDb();
  return database.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
};

export const getExpenses = async ({ date, category, search }) => {
  const database = await getDb();
  const clauses = [];
  const params = [];

  if (date) {
    clauses.push('date = ?');
    params.push(date);
  }
  if (category && category !== 'All') {
    clauses.push('category = ?');
    params.push(category);
  }
  if (search) {
    clauses.push('(notes LIKE ? OR category LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  return database.getAllAsync(`SELECT * FROM expenses ${where} ORDER BY date DESC, id DESC`, params);
};

export const getMonthlyExpenses = async (monthKey) => {
  const database = await getDb();
  return database.getAllAsync(
    'SELECT * FROM expenses WHERE substr(date, 1, 7) = ? ORDER BY date ASC, id ASC',
    [monthKey]
  );
};

export const getSetting = async (key) => {
  const database = await getDb();
  const row = await database.getFirstAsync('SELECT value FROM app_settings WHERE key = ?', [key]);
  return row?.value;
};

export const setSetting = async (key, value) => {
  const database = await getDb();
  return database.runAsync(
    'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    [key, value]
  );
};

export const seedSampleData = async () => {
  const database = await getDb();
  const row = await database.getFirstAsync('SELECT COUNT(*) as count FROM expenses');
  if (row?.count > 0) return;

  const now = new Date();
  const sample = [
    { amount: 12.5, category: 'Food', notes: 'Lunch', payment_mode: 'UPI' },
    { amount: 45, category: 'Fuel', notes: 'Petrol', payment_mode: 'Card' },
    { amount: 8, category: 'Store Grocery / Vegetables', notes: 'Tomatoes', payment_mode: 'Cash' }
  ];

  for (let i = 0; i < sample.length; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    await database.runAsync(
      `INSERT INTO expenses (amount, category, notes, date, payment_mode, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sample[i].amount, sample[i].category, sample[i].notes, d.toISOString().slice(0, 10), sample[i].payment_mode, new Date().toISOString()]
    );
  }
};
