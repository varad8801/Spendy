# Spendy - Offline Expense Tracker (Expo)

Spendy is an offline-first expense tracker built with React Native + Expo.
It stores data locally (SQLite), includes reminders, analytics, and CSV export for sharing.

## Features

- Quick expense entry with category and payment mode
- Local SQLite storage (`expenses` table)
- Expense list with filter, search, edit, and delete
- Daily reminder notifications
- Monthly analytics (category split + weekly trend)
- CSV export and share from Analytics
- Branded bottom tab navigation with icons
- Professional card-based UI optimized for mobile nav areas

## Tech Stack

- Expo SDK 54
- React Native + React Navigation
- `expo-sqlite`
- `expo-notifications`
- `expo-sharing`
- `react-native-chart-kit`
- Jest

## Project Structure

```
/components
/context
/database
/docs
/screens
/tests
/utils
App.js
eas.json
```

## Run Locally

```bash
npm install
npx expo start -c
```

Then open with Expo Go.

## Export Behavior

In Analytics:
1. Select month (`YYYY-MM`)
2. Tap `Export CSV`
3. File is saved locally and share sheet opens if available

## Build and Share APK

Quick command:

```bash
npx eas build -p android --profile preview
```

Detailed release guide is in:
- [docs/RELEASE_MANUAL.md](docs/RELEASE_MANUAL.md)

## GitHub Push

```bash
git add .
git commit -m "chore: polish UI and release docs"
git push
```

## Testing

```bash
npm test
```
