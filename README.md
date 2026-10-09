# Educar Mobile

Expo / React Native family portal integrated with the existing Supabase data model.

## Setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and supply only the public Supabase URL and public anon/publishable key.
3. Apply and test the backend finance migration chain in `../servidor` before connecting real families.
4. Start with `npm start` (native) or `npm run web`.

The app does not invent data when configuration is missing. Only active family accounts (`guardian` / `parent`) can access mobile screens. Administrative billing lives in the existing web portal.

## Verification

```sh
npm run lint
npx tsc --noEmit
node --test tests/*.test.mjs
npx expo export --platform web
```

For Android, configure an EAS project and run an explicitly authorized preview build using `eas.json`; no APK/build is included or claimed tested in this iteration.

## Documentation

- `docs/iteration-2026-10-08.md`: ten adopted plans, RF-M01–18 traceability, evidence and acceptance gaps.
- `docs/ai-log.md`: required AI development log.
- `../servidor/docs/mobile-billing-deployment.md`: database, private receipts, email scheduling and deployment safety.

## Explicit test-only preview

`node scripts/preview-fixture.mjs` starts a loopback synthetic API. Point development Expo at `http://127.0.0.1:54329` with `fixture-public-key` and use the synthetic account described in the iteration report. This harness is not imported by the app and is not production/backend authorization evidence.

Native credential storage uses Expo SecureStore. Web credentials remain memory-only. Uploaded transfer receipts remain pending until the school approves them; selecting a file never settles debt.
