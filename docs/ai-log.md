# AI development log

## October 8, 2026 — mobile integration iteration

- Problem: continue the minimalist mobile application from the supplied work plan, audit actual screens/requirements, implement missing modules and validations, use one orchestrator plus one code writer, create meaningful commits and deliver to main at iteration end.
- Tool: Codex, Ponytail full mode; persistent-memory plugin attempted but project ambiguity prevented memory saves.
- Prompt/input: user requested continued mobile implementation; clarified requirements are in the work plan under `/movil`; demanded ten plans, at least ten commits, final main upload and a 23:00 Buenos Aires deadline.
- Findings: existing mobile was mock-only. Existing Supabase already supplied identity, guardian relationships and service enrollment but no financial schema. SDK57 required Expo Router navigation exports. Docker/local DB unavailable.
- Changes: added shared invoice/transfer/reminder migrations and authorization; real mobile auth/family/finance flows; private file handling; web billing/report/review; tests and operational docs. Reused existing data relationships and visual palette.
- Results: recorded client unit tests/lint/typecheck, web build and preview runtime output. Database tests, native device, live mail and EAS deployment are explicitly not accepted as passed.
- Human review: orchestrator reviewed security boundaries and actual preview failures, leading to expiry/refresh, receipt retention, idempotency, service references, signed admin evidence and reminder backlog/calendar corrections.
- Follow-up: complete deployed Supabase integration, Android device checks, mail scheduling/provider setup and institutional acceptance. Do not treat generated source or synthetic preview as production evidence.

## 13 de octubre de 2026 — Demo visual en español
- Pedido: demo navegable para familias y estudiantes, sin backend, conservando Expo y sin dependencias nuevas.
- Cambios: modo explícito EXPO_PUBLIC_DEMO, estado local compartido, perfiles, facturas, comprobantes simulados, servicios, recorrido ilustrativo y cuenta.
- Los estudiantes no acceden a finanzas; los comprobantes pendientes no reducen deuda. GPS y operaciones reales fuera del alcance.

- Verificación: TypeScript y ESLint sin errores; 28 tests aprobados. Navegador a 390×844: transferencia parcial pendiente con deuda sin cambio, selección de Lucas con colectivo 07, avance de paradas y menú del estudiante sin finanzas. Demo disponible en localhost:8081.
