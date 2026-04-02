# Spendy - Offline First Expense Tracker (Expo)

Spendy is a complete **offline-first personal expense tracker** built with **React Native + Expo**.
All data is stored locally using **SQLite**. No backend, no API, no internet dependency.

## Features

- Fast expense entry with defaults and dropdowns
- SQLite local database (`expenses` table)
- Expense list with filters (date, category), search, edit, delete
- Daily local reminder notification (default 9:00 PM)
- Monthly analytics:
  - Total spend
  - Category totals (pie chart)
  - Weekly totals (bar chart)
- Export selected month to `.xlsx` and share
- Bottom tabs: Add Expense, Expenses List, Analytics, Settings
- Dark mode support (system theme)
- Sample data seeding on first run

## Tech

- Expo / React Native
- SQLite: `expo-sqlite`
- Notifications: `expo-notifications`
- Charts: `react-native-chart-kit`
- Excel export: `xlsx`
- Tests: `jest`

## Project Structure

```
/components
/screens
/database
/utils
/tests
/context
App.js
```

## Install & Run

```bash
npm install
npx expo start
```

Then choose Android/iOS simulator or Expo Go.

## Testing

```bash
npm test
```

## SQLite Schema

Table: `expenses`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `amount` REAL NOT NULL
- `category` TEXT NOT NULL
- `notes` TEXT
- `date` TEXT NOT NULL (YYYY-MM-DD)
- `payment_mode` TEXT NOT NULL
- `created_at` TEXT NOT NULL (ISO timestamp)

## Reminder Behavior

- Default enabled: `true`
- Default time: `21:00`
- Message: `Don't forget to log your expenses today!`

## Export Behavior

- Select month in Analytics (`YYYY-MM`)
- Tap **Export Month to Excel**
- File is written locally and sharing sheet opens (if available)

## Categories

- Food
- Rent
- Online Grocery
- Store Grocery / Vegetables
- Fuel
- Sin
- Bigsin
- Ecommerce
- Other (custom text input shown)

## GitHub Push Instructions

```bash
git init
git add .
git commit -m "feat: build offline-first Expo expense tracker"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Notes

- App is fully offline-first.
- No backend/API calls are used.
