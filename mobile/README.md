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

## Project DB assumptions (cards & rewards)

This app expects the following shape for card metadata in the `cards` table:

- `cards` rows contain a JSON/JSONB `metadata` column. The app looks for a `rewards` object inside that metadata, for example:

```json
{
   "rewards": {
      "groceries": 4.0,
      "dining": 3.0,
      "travel": 2.0
   }
}
```

- The `user_cards` table maps users to available card records. Use `lib/cards.ts` for the exact queries the app runs.
- The Purchase screen sorts the user's cards by `metadata.rewards[category]` (higher numeric value = better rewards). Cards with no value for the chosen category are treated as 0.

If you'd rather store reward rates in a dedicated table (e.g. `card_rewards(card_id, category, rate)`), the app logic can be adjusted — tell me and I can add the corresponding queries and migrations.
