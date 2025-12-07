# Card Helper
Offline credit card rewards helper built with Expo + React Native. No auth, no backend—data stays on device via AsyncStorage.

## What it does
- Manage your card list locally (add/delete, multi-select)
- Compare cards across 14 reward categories (groceries, dining, gas, travel, etc.)
- Dark-mode friendly UI with searchable add modal

## Run locally (Expo Go)
```bash
cd mobile
npm install
npx expo start --tunnel   # or --lan if on same Wi-Fi
```
Open the QR code in Expo Go.

## Dev notes
- Code lives in `mobile/` (Expo Router).
- No environment variables required (all data is static/offline).
- Lint: `cd mobile && npm run lint`

## Build for stores (summary)
- Install EAS CLI: `npm install -g eas-cli`
- Configure: `cd mobile && eas build:configure`
- Android AAB: `eas build --platform android --profile production`
- iOS: requires Apple account; build via EAS.
