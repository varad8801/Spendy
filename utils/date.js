export const formatDateInput = (date = new Date()) => date.toISOString().slice(0, 10);
export const getMonthKey = (date = new Date()) => date.toISOString().slice(0, 7);
export const toMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};
