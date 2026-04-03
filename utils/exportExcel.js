import { File, Paths } from 'expo-file-system';

const escapeCsvValue = (value) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export const exportExpensesToExcel = async (monthKey, expenses) => {
  const rows = [
    ['Date', 'Category', 'Amount', 'Notes', 'Payment Mode'],
    ...expenses.map((e) => [
      e.date,
      e.category,
      Number(e.amount).toFixed(2),
      e.notes || '',
      e.payment_mode,
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
  const file = new File(Paths.document, `expenses-${monthKey}.csv`);
  file.write(csv, { encoding: 'utf8' });

  return file.uri;
};
