const fakeDb = {
  execAsync: jest.fn(),
  runAsync: jest.fn(),
  getAllAsync: jest.fn(),
  getFirstAsync: jest.fn(),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => fakeDb),
}));

import { initDatabase, addExpense, getExpenses } from '../database';

describe('database operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes tables and settings', async () => {
    await initDatabase();
    expect(fakeDb.execAsync).toHaveBeenCalled();
    expect(fakeDb.runAsync).toHaveBeenCalledTimes(2);
  });

  it('adds expense row', async () => {
    await addExpense({ amount: 99, category: 'Food', notes: 'Dinner', date: '2026-04-02', paymentMode: 'UPI' });
    expect(fakeDb.runAsync).toHaveBeenCalled();
    const sql = fakeDb.runAsync.mock.calls[0][0];
    expect(sql).toContain('INSERT INTO expenses');
  });

  it('builds filter query for expenses list', async () => {
    fakeDb.getAllAsync.mockResolvedValue([]);
    await getExpenses({ date: '2026-04-02', category: 'Food', search: 'Din' });
    const [sql, params] = fakeDb.getAllAsync.mock.calls[0];
    expect(sql).toContain('WHERE');
    expect(params).toEqual(['2026-04-02', 'Food', '%Din%', '%Din%']);
  });
});
