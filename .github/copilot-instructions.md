## Card-Helper — Copilot instructions (concise)

This repository is an Expo + React Native (TypeScript) mobile app located in `mobile/`.
Below are the practical, repository-specific pointers an AI coding agent needs to be productive quickly.

1) Project layout & big picture
 - Mobile app: `mobile/` — an Expo app using file-based routing (`app/`), TypeScript and `expo-router`.
 - Auth & backend: uses Supabase for auth + DB. Client lives at `mobile/lib/supabaseClient.ts` and runtime keys are read via `mobile/lib/env.ts`.
 - Auth flow: centralized in `mobile/contexts/AuthContext.tsx`. Session tokens are stored via `mobile/lib/secure.ts` (Expo SecureStore). Note: `supabase.auth` is created with `persistSession: false` and session handling is done manually.
 - Card & rewards domain: DB queries and business logic are in `mobile/lib/cards.ts`. The Purchase UI (ranking cards by rewards) is at `mobile/app/(tabs)/purchase.tsx` and expects card rows to include `metadata.rewards` (see `mobile/README.md` for the exact shape).

2) Important developer workflows & commands
 - Install & start (dev):
   - cd into `mobile/` then `npm install` and `npm run start`.
 - Environment vars (.env): prefer `mobile/.env` or export `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`.
   - Helpful scripts: `npm run start:env` (loads `mobile/.env` via `dotenv-cli` and starts Expo with `--tunnel`), and `npm run start:env:lan` for LAN.
 - Run web: `npm run web` (inside `mobile/`).
 - Lint: `npm run lint`.

3) File-based routing and navigation quirks
 - Routes live under `mobile/app/`. There are route groups `(auth)` and `(tabs)` used to separate the auth flow from the main tabs.
 - The root layout (`mobile/app/_layout.tsx`) sets `unstable_settings.anchor = '(auth)/login'` so unauthenticated users land on the login screen by default — do not remove this unless you understand the auth gating changes.
 - Entry redirect logic: `mobile/app/index.tsx` redirects to `/(auth)/login` or `/(tabs)` depending on `useAuth()` state.

4) Data & database expectations (explicit patterns)
 - `cards` rows should include `metadata.rewards` object. Example: `{ rewards: { groceries: 4.0, dining: 3.0 } }`.
 - `mobile/lib/cards.ts` uses Supabase RLS assumptions: `user_cards` rows include `user_id` and `card_id`. If you modify queries, keep RLS implications in mind.
 - Reward sorting is implemented by reading `card.metadata?.rewards?.[category]` and treating missing values as `0` (see `mobile/app/(tabs)/purchase.tsx`).

5) Integration points & common edits
 - To change auth behavior, edit `mobile/contexts/AuthContext.tsx` and `mobile/lib/supabaseClient.ts`.
 - To change how rewards are computed or the DB shape, edit `mobile/lib/cards.ts` and the Purchase UI at `mobile/app/(tabs)/purchase.tsx`.
 - Environment runtime checks live in `mobile/lib/env.ts` — update it if you add new required variables.

6) Conventions & patterns to follow
 - TypeScript strict mode is enabled (`mobile/tsconfig.json`) and the path alias `@/*` maps to the `mobile/` root — use `@/` imports for consistency.
 - Avoid using Supabase's automatic session persistence: session tokens are saved/deleted explicitly via `mobile/lib/secure.ts`.
 - Keep UI and business logic separated: queries and data transforms are in `mobile/lib/*`; screens under `mobile/app/*` should call those helpers.

7) Quick examples
 - Start dev with `.env`:
   - `cd mobile && npm install && npm run start:env`
 - Add a card (backend call point): see `mobile/lib/cards.ts -> addUserCard(cardId)` — it calls `supabase.auth.getUser()` to obtain the current user id before inserting.

If anything above is unclear or you'd like examples for tests or local DB migrations, say which area (auth, cards, routing, or builds) and I'll expand or add small editable snippets & tests.
