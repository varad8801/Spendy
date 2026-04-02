export const calculateMonthlyAnalytics = (expenses = []) => {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

  const weeklyBuckets = { Week1: 0, Week2: 0, Week3: 0, Week4: 0, Week5: 0 };
  expenses.forEach((e) => {
    const day = Number(e.date.slice(8, 10));
    const week = `Week${Math.min(5, Math.ceil(day / 7))}`;
    weeklyBuckets[week] += Number(e.amount || 0);
  });

  return {
    total,
    categoryTotals,
    weeklyTotals: Object.entries(weeklyBuckets).map(([label, amount]) => ({ label, amount }))
  };
};
