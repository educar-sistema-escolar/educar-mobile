# Cierre del TP móvil Educar para Transformar

Actualizado: 03/11/2026. Grupo 9: Martín Moschen y Claudio Gómez. Esta entrega está preparada para revisión; **la integración completa y Android aún no están aceptados**.

## Matriz de Parte 3

| Requisito | Estado | Evidencia y límite |
|---|---|---|
| Arquitectura Expo, Router, TypeScript y Supabase compartido | Implementada pero no probada integralmente | Se reutilizan API, Auth, PostgreSQL, RLS y Storage; falta recorrido móvil conectado. |
| Ingreso, cierre, recuperación, rol y sesión | Parcial | 34 tests móviles incluyen autenticación simulada y vencimiento; falta ingreso nativo y recuperación real. |
| Familias e hijos vinculados | Parcial | RLS y prueba PostgreSQL aislada; verificación móvil real pendiente. |
| Cuotas, vencidos, detalle y filtros | Parcial | Consultas y cálculos implementados; falta contrastar importes reales por hijo y fechas en interfaz. |
| Historial, pagos parciales, múltiples comprobantes | Parcial | RPC y pruebas PostgreSQL locales verifican aprobación, duplicados y concurrencia; carga y descarga real Storage pendientes. |
| Estudiante sin pagos | Parcial | Restricción cliente y pruebas de aislamiento; verificar con identidad real y RLS remota. |
| Deportes, máximo dos, cupos y horarios | Parcial | Se reutiliza solicitud institucional; tests PostgreSQL de capacidad, superposición y duplicados aprobados. Falta UI conectada. |
| Transporte, parada y período | Parcial | Consulta por ciclo, ruta y parada; facturación conserva importe del período. El modelo de inscripción es anual, no prueba cambios mensuales. |
| Comedor y cursado | Implementada pero no probada | Consulta inscripciones y usos disponibles; falta probar permisos y datos reales. |
| Correo fin de mes con PDF | Parcial | Función, PDF y modo de prueba con dobles. Falta programador, despliegue, proveedor, calendario y envío controlado. |
| Correo día 20 solo deuda | Parcial | SQL local y worker simulado; recálculo antes de enviar, sin ejecución remota. |
| Reportes web financieros | Parcial | Código local con filtros, total y CSV; tests y build aprobados; falta prueba de nueva versión en navegador. |
| Accesibilidad y adaptación móvil | Parcial | Etiquetas, controles y teclado mejorados; falta contraste, lector de pantalla y dispositivos. |
| Integración web/móvil y RLS | Parcial | PostgreSQL local prueba aislamiento; panel remoto confirma RLS activa y bucket privado, pero falta prueba extremo a extremo. |
| APK y Android | Pendiente | Configuración EAS validada; CLI indica `Not logged in`; falta proyecto EAS, build, instalación y prueba. |
| Informe de IA y plan | Parcial | Borrador editable y trazabilidad; equipo debe validar testimonios y bitácora. |
| Evidencias visuales | Pendiente | Web institucional abierta en navegador; no se guardaron capturas de esta etapa. |

## Antecedentes y cambios

La demo visual sigue separada (`EXPO_PUBLIC_DEMO=true`) y usa datos ficticios. El modo integrado implementa autenticación y selección por rol, facturas, transferencias y servicios sobre Supabase. En esta iteración se agregaron consultas y solicitudes por ciclo, ficha académica, parada y uso de comedor; filtros financieros y CSV web; protección ante pulsación repetida y detalle de importes; auditoría y revalidación de recordatorios. Los cambios previos de los integrantes se preservaron.

El proyecto remoto identificado en Supabase es `nhwsgmijdsxzuxgpllhy`. Consulta de solo lectura: RLS activa en facturas, ítems, transferencias, comprobantes, recordatorios y solicitudes; bucket `transfer-receipts` privado, 5 MB, PDF/JPG/PNG. Había datos de facturación existentes. No se modificaron. El calendario de feriados tenía cero filas y `pg_cron` no estaba instalado; pueden existir otros programadores externos que no se verificaron. El navegador dejó de estar disponible por configuración de Work durante la continuación.

## Verificaciones

- Móvil: 34 tests Node aprobados, TypeScript y lint sin errores.
- Web: 23 tests aprobados, build y lint aprobados.
- Backend: 11 tests del worker con servicios simulados aprobados. PostgreSQL 18 temporal con fixtures de plataforma aprobó RLS, pagos parciales, duplicados, bloqueos concurrentes, solicitudes, horarios, cupos, feriado, revalidación de deuda y revocación. No equivale a prueba de Supabase real o Storage.
- Navegador: se abrió la web institucional y su pantalla administrativa de facturación existente; se observaron valores y transferencias DEMO. La nueva versión local no se comprobó allí. No se guardaron capturas.
- Android, Expo Go, descarga de archivo privado, sincronización real entre clientes y correo real: no probados.

## Recordatorios

No se enviaron correos. El worker local usa hora de Buenos Aires, cola idempotente, PDF, auditoría de intentos y `dry_run`; el calendario de feriados requiere mantenimiento. Deben aplicarse y verificarse en ambiente aislado la nueva migración y el worker juntos, configurar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BILLING_CRON_SECRET`, `RESEND_API_KEY` y `BILLING_FROM_EMAIL` en el servidor, configurar scheduler y remitente verificado, y comprobar entrega controlada. El PDF es estado de cuenta, no comprobante fiscal certificado. Detalles: `../educar-servidor/docs/mobile-billing-deployment.md`.

## Cómo ejecutar

Desde `educar-mobile`: `npm ci`; para demo, `EXPO_PUBLIC_DEMO=true` en `.env.local`; ejecutar `npm run web -- --localhost --port 8081`. Para datos compartidos usar `EXPO_PUBLIC_DEMO=false`, URL y clave **pública** del proyecto en `.env.local` según `.env.example`; usar cuentas DEMO autorizadas, nunca `service_role`. Reiniciar Expo luego de cambiar variables. En navegador la sesión no persiste; en nativo usa SecureStore.

Android: ejecutar `npx eas-cli login`, `npx eas-cli init`, configurar las variables públicas del proyecto en EAS y `npx eas-cli build -p android --profile preview`; el perfil `demo` genera la demo visual. El identificador propuesto `ar.edu.educar.mobile` debe confirmarse con la institución. Se requiere cuenta Expo y proyecto EAS; ningún APK fue generado.

## Archivos y migraciones

Móvil: rutas de inicio, cuotas, servicios y transferencia, `lib/services.ts`, proveedores de familia/auth existentes, estilos, configuración Expo/EAS y tests. Web: `BillingPage.tsx`, `billingReport.ts` y tests. Backend: `billing-reminders/index.ts`, tests y migración local `20261103191021_billing_reminder_delivery_audit.sql`, todavía no aplicada. Estado exacto: `git status` en cada repositorio. No hubo commit, push, merge ni despliegue.

## Documentos y pendientes

Informe editable: `entregables/Informe_IA_Grupo9.md`. Plan original: `../educar-cliente/docs/project-reference/Plan de Trabaj1.docx`. Consigna: `C:/Users/juanm/Downloads/TP-Metodologia-3.pdf`. QA anterior: `../educar-cliente/docs/RESUMEN_ETAPA_3_QA_FINAL.md`. Se verificó que el token GitHub carece del permiso `read:project`, por lo que no se inspeccionó ni actualizó Projects. Hitos: testing 11/11/2026 e informe 17/11/2026.

## Continuación: integración real del 03/11/2026

Se configuró `.env.local` con la URL y la clave pública del proyecto Supabase ya usado por la web. La configuración visual anterior se conservó en `.env.demo-preintegracion.local`; ambos archivos están ignorados por Git. El modo por defecto local es integrado. No se copiaron claves de servidor al móvil.

Prueba real de solo lectura mediante el código de `lib/api.ts` y `lib/services.ts` con cuentas DEMO existentes: autenticación y cierre de sesión de padre y estudiante; dos hijos vinculados del padre; dos facturas por hijo, dos transferencias y apertura de dos PDF mediante URL firmada; deportes, profesores, horarios, transporte, parada, comedor y cursado para ciclo 2027; consulta de alumno y facturas ajenas devolvió cero filas para la familia; el estudiante vio su ficha y cero facturas. No se insertaron solicitudes ni transferencias ni se modificaron registros. La consulta directa del docente devuelve null por RLS: se corrigió usando la RPC autorizada `list_sport_request_options`, y se verificó que los tres deportes inscritos muestran profesor.

Se exportó la versión web integrada con `npx expo export --platform web`; esto verifica el empaquetado y no equivale a una prueba en navegador ni Android. Pasaron 34 tests móviles completos, más la nueva prueba específica de profesor, TypeScript y lint. El navegador integrado no está disponible porque la configuración de Work lo deshabilita; resta probar visualmente los recorridos reales, selección de archivos y presentación/aprobación DEMO de extremo a extremo.

El APK requiere intervención: `npx eas-cli whoami` devuelve `Not logged in`; no se detectó SDK de Android, emulador ni adb, y solo está disponible Java 8. Iniciar sesión con `npx eas-cli login`, vincular mediante `npx eas-cli init`, configurar para el entorno EAS las variables públicas `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` y `EXPO_PUBLIC_PASSWORD_RESET_URL`, y ejecutar `npx eas-cli build --platform android --profile preview`. El perfil `demo` permite un APK visual separado. Confirmar el identificador Android institucional y verificar la instalación en un dispositivo. No existe APK generado ni probado.

## Cambio de criterio de demostración

Por indicación del equipo, la demostración se realizará mediante Expo Go y no es necesario generar un APK. Para iniciar el modo integrado: `npx expo start --go --lan --port 8081`. La prueba en teléfono sigue pendiente. El detalle del trabajo está en `entregables/Informe_trabajo_realizado_Grupo9.md`.

Compatibilidad Expo: luego de actualizar los parches recomendados de SDK 57 y retirar opciones obsoletas, `expo-doctor` pasó 21/21 controles; 35 pruebas móviles, TypeScript y lint pasaron. `npm` informó 30 vulnerabilidades en dependencias que requieren revisión; no se ejecutó una actualización forzada.
