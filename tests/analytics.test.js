import { calculateMonthlyAnalytics } from '../utils/analytics';

describe('calculateMonthlyAnalytics', () => {
  it('calculates totals, categories, and weeks', () => {
    const result = calculateMonthlyAnalytics([
      { amount: 100, category: 'Food', date: '2026-04-02' },
      { amount: 50, category: 'Fuel', date: '2026-04-10' },
      { amount: 70, category: 'Food', date: '2026-04-22' },
    ]);

    expect(result.total).toBe(220);
    expect(result.categoryTotals.Food).toBe(170);
    expect(result.categoryTotals.Fuel).toBe(50);
    expect(result.weeklyTotals.find((w) => w.label === 'Week1').amount).toBe(100);
    expect(result.weeklyTotals.find((w) => w.label === 'Week2').amount).toBe(50);
    expect(result.weeklyTotals.find((w) => w.label === 'Week4').amount).toBe(70);
  });
});
