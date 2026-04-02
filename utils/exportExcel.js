import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportExpensesToExcel = async (monthKey, expenses) => {
  const rows = expenses.map((e) => ({
    Date: e.date,
    Category: e.category,
    Amount: Number(e.amount),
    Notes: e.notes || '',
    'Payment Mode': e.payment_mode,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const path = `${FileSystem.documentDirectory}expenses-${monthKey}.xlsx`;

  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, {
      UTI: 'org.openxmlformats.spreadsheetml.sheet',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  return path;
};
