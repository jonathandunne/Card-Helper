# Card-Helper
A credit card rewards tracker and banking app all in one!

## Setup & run (mobile)

These instructions cover running the Expo mobile app located in the `mobile/` folder.

Prerequisites

- Node.js (LTS) — use nvm if you want to manage versions. Example:

```bash
# install nvm (if you don't have it), then install Node LTS
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

- Expo CLI tools are available via `npx` (no global install needed) or install `eas-cli` when you plan to build production binaries:

```bash
# optional global EAS CLI for builds
npm install -g eas-cli
```

Quick start (development with Expo Go)

1. Install dependencies for the mobile app:

```bash
cd mobile
npm install
```

2. Provide Supabase keys (if you plan to use authentication features). Create a `.env` or set environment variables in your shell:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Start the Expo dev server using the tunnel (most reliable across networks):

```bash
npx expo start --tunnel
# or
npm run start -- --tunnel
```

4. Open the Expo Go app on your phone and scan the QR code shown in the terminal or the DevTools web page.

Notes

- If your phone is on the same Wi‑Fi network as your machine, you can use LAN mode which is usually faster:

```bash
npx expo start --lan --host 0.0.0.0
```

- If the tunnel (ngrok) times out or is unreliable on your network, prefer LAN mode or obtain an ngrok auth token and configure it.
- For Google/Apple OAuth and some native modules, Expo Go may not work. Use an EAS dev build (recommended) to create a custom dev client with native configuration:

```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

## Using a local `.env` file

This project supports loading local environment variables from `mobile/.env` when starting the Expo dev server. A small helper (`dotenv-cli`) is installed as a dev dependency and we've added convenience npm scripts that load the `.env` file before launching Expo.

1. Copy the example file and fill in your Supabase values:

```bash
cp mobile/.env.example mobile/.env
# edit mobile/.env and set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY
```

2. Start Expo with the `.env` variables loaded (tunnel):

```bash
cd mobile
npm run start:env
```

3. Or start in LAN mode with `.env` loaded:

```bash
cd mobile
npm run start:env:lan
```

If you prefer not to use the scripts, you can also export the variables in your shell before running `npx expo start`:

```bash
export EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export EXPO_PUBLIC_SUPABASE_KEY="your-publishable-key"
npx expo start --tunnel
```

Security note: `mobile/.env` is included in the repository's `.gitignore` to avoid accidentally committing secrets. Never commit your real keys to source control.

Run web

```bash
cd mobile
npx expo start --web
```

Linting

```bash
cd mobile
npm run lint
```

Building production binaries

Use EAS Build to produce signed binaries for the Play Store / App Store. See Expo docs: https://docs.expo.dev/eas-build/

If you need help configuring Supabase, OAuth redirect URIs, or creating an EAS dev build, tell me which one and I will walk you through the exact steps.
