# Spendy Release Manual (APK + GitHub)

## 1. One-Time Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
3. Login to Expo:
   ```bash
   eas login
   ```
4. Configure build credentials for this app:
   ```bash
   npx eas build:configure
   ```

Before first Android build, set a unique package id in `app.json`:

```json
{
  "expo": {
    "android": {
      "package": "com.yourname.spendy"
    }
  }
}
```

## 2. Build a Shareable APK

Run:

```bash
npx eas build -p android --profile preview
```

What happens:
- Expo cloud builds an `.apk` (installable file).
- You get a build URL in terminal.
- Open that URL, download APK, and share it directly.

## 3. Build Play Store Bundle (AAB)

Run:

```bash
npx eas build -p android --profile production
```

This produces an `.aab` (for Play Store upload).

## 4. Local Install Test Before Sharing

After downloading the APK:

1. Copy APK to your Android phone.
2. Enable "Install unknown apps" for the file manager/browser.
3. Install and open the app.

## 5. GitHub Publish Flow

```bash
git add .
git commit -m "chore: polish UI and add release manual"
git push
```

Suggested release flow:
1. Create a GitHub Release tag.
2. Attach the built APK file to the release.
3. Share release URL with testers.
