# Educar Mobile

Expo-managed React Native application for Educar, built with TypeScript and Expo Router.

## Expo SDK

This project targets Expo SDK 54 and Expo Go. Keep Expo-managed package versions aligned with SDK 54 by using `npx expo install` for Expo/React Native libraries.

## Run locally

```sh
npm install
npm start
```

Use the Expo Go app to scan the development QR code. Helpful shortcuts: `npm run android`, `npm run ios`, and `npm run web`.

## Project structure

- `app/` — file-based routes and layouts (`(tabs)/` for tab screens).
- `components/` — shared interface components; `components/ui/` contains platform-specific UI primitives.
- `constants/` — shared theme and static values.
- `hooks/` — reusable React hooks.
- `assets/` — app icons, splash assets, and other static resources.
- `scripts/` — local project maintenance scripts.

## Git hygiene

Dependencies, Expo/Metro caches, generated build output, local environment files, signing keys, and generated `ios/`/`android/` folders are ignored. Commit `.env.example` for documented variable names; never commit secrets.
