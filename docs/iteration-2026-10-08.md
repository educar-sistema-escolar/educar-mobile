# Mobile iteration — October 8, 2026

## Scope and delivery status

Source requirements: `Plan_de_Trabajo_App_Movil_Grupo9.pdf` (19 pages), RF-M01–RF-M18.
One orchestrator and one implementation worker. Existing minimalist English mobile UI retained; existing Spanish administrative web UI extended. No production migrations, secrets, emails, or EAS builds were deployed. Source completion is not production acceptance.

## Ten adopted plans

1. Audit requirements/screens and repair SDK57 navigation/types; add boundary validation tests.
2. Add invoice/item/value schema, immutable integer-cent price snapshots and guardian authorization.
3. Register atomic pending transfers, selected concepts and private multi-receipt storage.
4. Integrate real family authentication, protected routes and expiry/refresh handling.
5. Add account logout, email recovery/deep link and password change.
6. Load linked children, live debt and actual sports/transport/dining enrollments.
7. Filter invoices by dates and display associated receipt/history data.
8. Select unpaid concepts, validate amount/files and acknowledge/share transfer operations.
9. Add administrative prices, snapshot invoice issuance, evidence review/approval, income and service payment reports.
10. Add deduplicated scheduled-email worker, PDF invoice attachments, testing/build/deployment and AI usage records.

## Requirement traceability

| Requirement | Implemented source | Acceptance still required |
| --- | --- | --- |
| RF-M01–04 | Supabase REST auth, active family profile check, route guards, secure native storage, refresh, logout/recovery/change | Real parent credentials, Supabase redirect allowlist, native deep link |
| RF-M05–06 | Per-child outstanding item debt, confirmed payments and transfer history | Applied SQL/RLS behavior and real dataset |
| RF-M07 | Date-filtered invoices and associated private receipts | Live storage signed downloads |
| RF-M08–09 | Selected invoice concepts, partial amount, PDF/JPG/PNG 5 MB receipt, multiple attachments, idempotent retry | Native picker/Android upload and server transaction integration |
| RF-M10 | Shareable operation acknowledgment; approved operation payment receipt; pending upload never shown as paid | Institutional legal/fiscal receipt approval; real approved transfer |
| RF-M11 | Existing child-scoped sports/routes/dining queries | Real backend response and native UI |
| RF-M12 | Administrative values and monthly invoice price snapshots | Deployed configuration and operator flow |
| RF-M13–14 | Server-only queue, business calendar, last-business-day/day-20 preparation, PDF invoices, provider idempotency | Holiday data, server secrets, verified sender, deployed worker and recurring scheduler |
| RF-M15–18 | Period income, complete/incomplete invoices, sports/level/schedule/teacher and route payment data | Live reports and administration acceptance |

## Evidence

- Initial `npx tsc --noEmit`: failed on existing SDK57 type incompatibilities. Navigation additionally failed in a real preview due obsolete React Navigation imports; migrated to Expo Router exports rather than suppressing compatibility checks.
- Validation and single-flight money tests recorded failing missing-module runs before implementation, then passed.
- `node --test tests/*.test.mjs`: 12 passed after date and receipt-identity correction, including real auth module under mocked network/storage boundaries.
- `npm run lint` and `npx tsc --noEmit`: passed during implementation; final normalized-source checks recorded in handoff.
- Web `npm run build`: passed (large existing bundle warning). Whole-web `npm run lint`: failed on existing pages plus one introduced billing effect error, subsequently fixed; scoped changed-file lint is required.
- `supabase test db`: did not pass; cancelled after no response. Docker daemon unavailable (`dockerDesktopLinuxEngine` pipe missing). SQL pgTAP source contains 10 structure/denial tests plus 18 ownership, foreign concepts, idempotency, pending/approved allocation and inactive-parent scenarios. These are NOT executed DB proof.
- Expo preview uses an explicit localhost fixture API through the same client auth/query routes. It provides synthetic client-flow/visual evidence only, not database policy evidence.

## Safe synthetic preview

Run `node scripts/preview-fixture.mjs`. In a separate shell set public Expo URL to `http://127.0.0.1:54329`, public key to `fixture-public-key`, then start Expo web. The fixture binds loopback only and is outside the application bundle. Credentials: `family@example.test` / `FixturePassword12!` (synthetic, not a production account).
HTTP backend URLs are accepted only for loopback during development. Production requires HTTPS. Never commit a real credential or service-role key. Web sessions remain memory-only; native sessions use SecureStore.

## Operational limitations

- No Android hardware/emulator or EAS binary tested. Native packages require the appropriate development/build runtime.
- Financial migrations have not been applied or executed. Review and execute pgTAP against a disposable full Supabase database before production use.
- Money values are positive integer cents with safe JavaScript bounds. Invoice prices are snapshots; future configured prices do not change issued debt.
- A transfer remains pending until a billing administrator inspects private evidence and approves/rejects it. Approval atomically allocates partial payment to selected concepts in deterministic ID order.
- Failed/ambiguous submission retains the uploaded path for retry. Associated evidence cannot be deleted by the cleanup policy. Unattached uploads require controlled cleanup; do not blindly delete after an ambiguous timeout.
- Mail queues are drained in bounded 50-message batches. Schedule the worker repeatedly (e.g. every 10 minutes), not only once per month. Preparation catches up the previous seven dates; longer outages require explicit backfill. Provider-ambiguous `sending` rows require manual reconciliation, never automatic replay.
- Maintain `billing_non_business_days` for institutional holidays. No holiday calendar is fabricated.
- Generated PDF statements are institutional billing documents, not certified fiscal invoices. Confirm institution requirements before acceptance.
- Dependency audit surfaced 30 vulnerabilities on installation; no broad/force dependency upgrade was performed. A baseline comparison and production advisory review remain required.

## Commit evidence

Implementation commits were created in three existing repositories; main integration/push is owned by the orchestrator. Complete commit IDs can be recovered with `git log --since=2026-10-08 --oneline` in each repository. Notable checkpoints: mobile `8f4eac4`, `41ed05e`, `bd2045b`, `caffe99`, `1ac10c3`, `4716c52`, `7231c17`, `6110900`, `e76d2c9`, `13b5869`, `d4f73d7`; server `4ad3a00`, `8622aea`, `eb0051b`, `904ad9e`, `f9d3b11`, `c0b4c71`, `662bf76`, `a53eee1`, `7f76ffa`, `2e2aa20`; web `d6afcbe` plus evidence/select usability fix. No empty commits or AI attribution.

## Final audit additions

The orchestrator subsequently rendered the production components at 390×844 through the explicit fixture API and verified login, home, services, invoices, date validation, selected concepts, PDF selection, excessive-amount rejection and partial pending submission. Audit findings led to SDK navigation migration, date-input minimum-width correction, native/web checkbox accessibility, truthful configuration states and Buenos Aires timestamp display. These checks are synthetic client-flow evidence, not PostgreSQL or Android proof.

Backend worker mock tests: `node --test tests/billing-reminders.test.mjs` passed 4 cases, including 51-message drainage over two calls, secret rejection, PDF generation requeue and ambiguous provider outcome retention. There are 28 authored pgTAP assertions, still unexecuted because the local database is unavailable. Source normalization used the installed TypeScript printer before final checks.

Whole-web lint retains four pre-existing errors in news/header pages and four existing warnings; the introduced billing-effect issue was corrected and changed-file lint passes. A previously completed mobile web export generated 13 static routes; the final normalized-source export is tracked in the final handoff.

## Final check receipt (before orchestrator push)

- Mobile `npm run lint`: PASS.
- Mobile `npx tsc --noEmit`: PASS.
- Mobile `node --test tests/*.test.mjs`: PASS, 12/12.
- Mobile `npx expo export --platform web`: PASS, 13 static routes generated from the final receipt-identity fix.
- Web `npx eslint src/pages/admin/BillingPage.tsx src/pages/admin/AdminLayout.tsx src/App.tsx`: PASS.
- Web `npm run build`: PASS; existing large-bundle warnings remain.
- Backend `node --test tests/billing-reminders.test.mjs`: PASS, 4/4 under mocked provider/database/PDF boundaries.
- Backend Edge worker TypeScript syntax: PASS, not Deno deployment proof.
- PostgreSQL `supabase test db`: UNAVAILABLE / NOT PASSED (cancelled after no response; Docker daemon missing).
- Native Android, real Auth recovery mail, live database/storage and scheduled email: NOT VERIFIED.
- `npm audit --omit=dev --json`: reports 30 advisories (11 moderate, 19 high, no critical). All 35 affected dependency paths retain the same versions as the initial remote lockfile; none were introduced or changed by the two added native packages. No force upgrade or TLS-validation bypass was used.

Additional real rendered audit by the orchestrator: two receipt links under one pending partial operation, unchanged debt after uploading, account layout, short-password rejection, sign-out routing, and missing-email recovery rejection. The second-attachment acknowledgment initially displayed a receipt ID; a narrow regression test proved the failure, then the source was corrected to retain the original operation ID and all 12 tests/export passed. The preview evidence remains synthetic and no real password mutation or mail was performed.
