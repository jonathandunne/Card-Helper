# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Project Overview

This is a standalone card rewards management app built with Expo and React Native. The app works completely offline and stores all data locally on your device using AsyncStorage.

### Features
- **Local storage only** - No authentication or internet connection required
- **5 pre-configured student credit cards** with reward rates
- **Cards tab** - Add or remove cards from your collection
- **Purchase tab** - View your cards ranked by rewards for different categories (Groceries, Dining, Travel, Gas, Streaming, Other)

### Card Data Storage

**Available Cards:**
- 5 credit cards hardcoded in `lib/cards.ts` with reward percentages for each category
- Cards stored in memory as static constants

**User's Selected Cards:**
- Stored locally in AsyncStorage under key `selected_cards`
- Persists across app restarts
- No cloud sync - data stays on your device

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Open in:
   - Android emulator: Press `a`
   - iOS simulator: Press `i`
   - Web browser: Press `w`
   - Expo Go app: Scan QR code
