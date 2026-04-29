# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go)
npx expo start --ios    # Run on iOS simulator
npx expo start --android # Run on Android emulator
npm run lint            # Run ESLint via expo lint
```

There is no test suite yet.

## Architecture

This is an **Expo Router** app (file-based routing) using React Native with the New Architecture enabled and React Compiler experimental flag on.

### Navigation flow

```
app/_layout.tsx          # Root Stack: onboarding → (tabs)
app/onboarding.tsx       # First-run screen; collects body weight + 1RM lifts, saves to AsyncStorage, then navigates to /(tabs)
app/(tabs)/_layout.tsx   # Bottom tab navigator (4 tabs)
app/(tabs)/index.tsx     # Home — reads userData from AsyncStorage, redirects to /onboarding if missing
app/(tabs)/workout.tsx   # Placeholder
app/(tabs)/progress.tsx  # Placeholder
app/(tabs)/profile.tsx   # Placeholder
```

### Data persistence

All user data is stored in `AsyncStorage` under the key `"userData"` as a JSON object:

```ts
{
  bodyWeight: number,  // kg
  squat: number,       // 1RM kg
  bench: number,       // 1RM kg
  deadlift: number,    // 1RM kg
}
```

The home screen (`index.tsx`) owns the redirect logic: if `"userData"` is absent it pushes to `/onboarding`; onboarding writes the key and calls `router.replace("/(tabs)")`.

### Design system

Dark theme throughout — background `#0a0a0a`, card surfaces `#1a1a1a`, accent/primary `#FFD700` (gold), muted text `#888`/`#aaa`/`#555`. All styling is done with `StyleSheet.create` inline per file; there is no shared theme file in the active codebase (`app-example/constants/theme.ts` exists but is unused reference code).

### Path aliases

`@/*` maps to the repo root (configured in `tsconfig.json`), so imports can use `@/app/...`, `@/assets/...`, etc.

### app-example/

This directory is the Expo starter template left for reference. It is **not part of the active app** and should not be modified or imported.
