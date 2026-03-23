# Restaurant App (Mobile)

Cross-platform restaurant ordering app built with **Expo** and **React Native**. Customers can browse the menu, manage a cart, check out, and track orders. Authentication and data are backed by **Supabase**.

This repository’s root project is the mobile app. A separate **CMS** web app for administration lives in the [`CMS`](./CMS/) folder.

## Tech stack

| Area | Technology |
|------|------------|
| Runtime | Expo SDK 54, React Native 0.81, React 19 |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routes) |
| State | Redux Toolkit, React Redux |
| Backend | Supabase (Auth, Postgres) |
| Language | TypeScript |

Optional dependencies include `@stripe/stripe-react-native` and `stripe` for future or integrated payment flows.

## Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)
- For device builds: **Android Studio** / Xcode as required by [Expo’s environment setup](https://docs.expo.dev/get-started/set-up-your-environment/)

## Environment variables

Create a `.env` file in this directory (project root) with your Supabase project credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

`app.config.js` passes these into `extra` so the client can read them via Expo config; `lib/supabase.ts` also supports `SUPABASE_URL` and `SUPABASE_ANON_KEY` as fallbacks.

Full database setup, table SQL, and CMS env vars are documented in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**.

## Install and run

```bash
npm install
npm start
```

Then choose a target from the Expo CLI (development build, Android emulator, iOS simulator, or web). Equivalent shortcuts:

```bash
npm run android   # native Android build/run
npm run ios       # native iOS build/run
npm run web       # web
```

## Useful npm scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` / `npm run ios` | Run on Android / iOS |
| `npm run web` | Run the web target |
| `npm run lint` | Run ESLint (Expo config) |
| `npm run upload-food-items` | Upload food items via `scripts/upload-food-items.mjs` (requires `.env`) |
| `npm run prebuild:android` | Regenerate the `android/` native project (`expo prebuild --clean`) |
| `npm run build:apk:debug` | Debug APK (see below) |
| `npm run build:apk` | Release APK (see below) |
| `npm run reset-project` | Expo template helper: moves starter code to `app-example` and clears `app/` |

## Android APK builds

Local Gradle builds (JDK 17, `ANDROID_HOME`, signing for release) are documented in **[BUILD-ANDROID.md](./BUILD-ANDROID.md)**.

## Project layout (high level)

| Path | Role |
|------|------|
| `app/` | Screens and routes (Expo Router) |
| `components/` | Shared UI components |
| `lib/` | Supabase client and helpers |
| `services/` | API and domain services (e.g. auth, orders) |
| `store/` | Redux store and slices |
| `assets/` | Images, fonts, icons |
| `scripts/` | SQL and utility scripts; see [scripts/README.md](./scripts/README.md) |

## Deep linking

The app scheme is `restaurantapp20` (see `app.config.js` / `app.json`), for universal links and `expo-linking` if you configure domains later.

## Further reading

- [Expo documentation](https://docs.expo.dev/)
- [Supabase JavaScript client](https://supabase.com/docs/reference/javascript/introduction)
- [README_SUPABASE_TYPES.md](./README_SUPABASE_TYPES.md) — generated Supabase types (if you use them)
