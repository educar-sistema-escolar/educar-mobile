# QA final Educar Mobile — revisión en curso

Fecha: 03/11/2026. **Estado: parcial; falta revisión visual obligatoria en navegador integrado y dispositivo.**

## Navegador y experiencia visual

No se verificaron pantallas ni se generaron capturas en esta etapa: el navegador integrado devuelve que el uso de navegador local está deshabilitado en la configuración de Work. Se solicitó habilitarlo. No se han evaluado manualmente alineación, contraste, lector de pantalla, consola ni formularios. No se declara accesibilidad aprobada.

## Pruebas realizadas

- `npm run lint`: aprobado.
- `npx tsc --noEmit`: aprobado.
- `node --test tests/*.test.mjs`: 35 aprobadas.
- `npx expo-doctor`: 21/21 comprobaciones aprobadas.
- En la etapa anterior se comprobó acceso DEMO real de familia y estudiante por API, lectura de facturas y servicios, dos PDF privados y aislamiento de alumno ajeno. No es una prueba de interfaz ni prueba de una transferencia nueva.
- En la etapa anterior pasaron pruebas PostgreSQL aisladas de pagos parciales, RLS, concurrencia, solicitudes, recordatorios y saldos; 11 pruebas del worker utilizaron dobles. No se enviaron correos reales. La nueva migración y el worker no están desplegados, ni hay programador o proveedor verificado.
- Expo Go y Android: pendiente de prueba física. El proyecto utiliza SDK 57. Ejecutar `npx expo start --go --lan --port 8081` en `educar-mobile` y abrir el QR con un teléfono y versión compatible de Expo Go; probar ambos perfiles, red, selección de PDF, teclado y navegación. La conexión debe compartir red y el modo real necesita las variables públicas configuradas.

## Dependencias

`npm audit --omit=dev` identifica, entre otras, `expo-router → query-string → decode-uri-component@0.2.2` con avisos de denegación de servicio por cadenas codificadas malformadas. Puede afectar al tratamiento de enlaces; no se evaluó su explotabilidad concreta en esta aplicación. `zod@3.25.76`, `glob@13.0.6` y `minimatch@10.2.6` aparecen principalmente bajo herramientas de Expo/CLI y configuración; se requiere evaluar rutas de ejecución antes de concluir impacto. npm propone para varios casos cambios de versión mayor de Expo o Router, incompatibles con la premisa de conservar SDK 57 sin validación; no se aplicó `audit fix --force`.

## Pendientes

Habilitar el navegador integrado y recorrer pantallas, estados, fechas, pagos, solicitudes y reportes; registrar capturas y revisar red/consola. Verificar en ambiente DEMO controlado subida de varios comprobantes, aprobación y saldos, con limpieza segura. Ejecutar exportación web de esta etapa y comprobar la aplicación en Expo Go. Revisar y desplegar recordatorios solo después de validar entorno, proveedor, feriados y programación. Completar este informe con resultados reales; no hubo commit, push ni despliegue.

Actualización: `npm ci` reconstruyó la instalación desde el lockfile y restituyó el archivo faltante de `standard-navigation`. La exportación web posterior terminó correctamente con 18 rutas; Metro avisó que no pudo leer su caché y reconstruyó el índice. El navegador integrado se volvió a solicitar y la herramienta siguió informando que el uso del navegador local está deshabilitado; no se pudo determinar la causa de esa respuesta.

## Continuación visual y Design System — 03/11/2026

Se reanudó el navegador integrado y se comprobaron Familia y Estudiante contra Supabase. Familia: selección de dos alumnos, saldos, filtro de 2027 y validación de comprobante faltante sin enviar; Estudiante: ingreso, ausencia de pestaña de cuotas y consulta de servicios y cursado 2027. Se tradujeron pantallas y mensajes visibles y se corrigió un saludo sin nombre y el recorte del botón de ciclo. El detalle visual y las limitaciones se registraron en `REVISION_DESIGN_SYSTEM_MOVIL.md`.

Al reiniciar Metro para revisar DEMO apareció un error de resolución de `styleq/transform-localize-style` tanto en el servidor DEMO como en el integrado. No se confirma la causa. Faltan capturas, verificación de todas las pantallas y tamaños, pruebas de envío/aprobación real de DEMO y Expo Go.

## Actualización de Metro y evidencias

Se reparó localmente la instalación de `styleq` conservando los hashes y Metro volvió a compilar integrado y DEMO. Se guardaron seis capturas web de 360, 390 y 768 px bajo `docs/evidencias-qa`; el detalle y límites de las verificaciones figuran en `REVISION_DESIGN_SYSTEM_MOVIL.md`. Tras corregir un encabezado recortado se ejecutaron lint, TypeScript, 37 pruebas y Expo Doctor 21/21. Continúan pendientes Expo Go, accesibilidad con lector de pantalla y pruebas reales de carga/aprobación de comprobantes. La reparación en `node_modules` puede requerirse nuevamente después de una reinstalación o sincronización de OneDrive.

## Pruebas de comprobantes y alcance localhost — 03/11/2026

Por indicación posterior del usuario, la prueba visual se realizó en localhost; no se considera una prueba nativa de Expo Go. Se verificó que el equipo no presenta un dispositivo Android, `adb` ni emulador detectables. No se generó APK.

En el navegador integrado sobre `localhost:8084`, modo DEMO visual, se abrió una factura ficticia, se seleccionó el archivo `tests/fixtures/transfer.pdf`, se informó un importe parcial de $1.000 y se obtuvo el estado «En revisión». La deuda permaneció en $78.500. Es una simulación en memoria: no sube el archivo al servidor ni realiza una aprobación administrativa.

En PostgreSQL 18 temporal se ejecutó `node --test tests/pg-finance.test.mjs`: aprobado. El caso usa migraciones y fixtures de plataforma y comprobó una operación pendiente con dos registros de comprobantes, reintento idempotente, saldo sin modificar antes de aprobación, aprobación parcial y saldo actualizado, además de restricciones y concurrencia. Los archivos físicos se simulan mediante metadatos de Storage; no representa una prueba del servicio Supabase Storage completo. La base temporal se detuvo y eliminó.

Antes de la indicación de limitar las pruebas a localhost, se había probado el bucket privado real con un PDF temporal sin asociar: subida y descarga por el propietario con bytes idénticos; intento de firmar el archivo con el usuario estudiante rechazado; eliminación del objeto temporal y comprobación de que ya no se podía firmar. No se creó ni aprobó una transferencia en el entorno remoto. En consecuencia, el flujo integrado completo de selección, subida, asociación y aprobación sobre el mismo comprobante sigue sin probarse de extremo a extremo.

El arranque de un servidor Expo adicional apuntando al fixture local fue rechazado por la revisión automática con un bloqueo de política sin motivo más específico. La demostración ya disponible en localhost permitió probar el formulario visual simulado. No se modificaron datos financieros institucionales, ni se hizo commit, push o despliegue.

## Flujo integrado de comprobante en Supabase local — 03/11/2026

Se inició una instancia Supabase aislada en Docker (`qa-local`, API en `127.0.0.1:54321`) y se aplicaron las migraciones existentes del backend. Se crearon cuentas y datos ficticios exclusivamente en esa instancia. La prueba `educar-servidor/tmp/qa-local/verify-flow.cjs` ejecutó llamadas HTTP autenticadas a Auth, Storage y las RPC reales del proyecto. Resultado: **aprobada a nivel de API y base de datos**.

- Se cargó un PDF real en el bucket privado y se descargó con la cuenta propietaria; los bytes coincidieron.
- Se presentó una transferencia parcial y se verificaron la asociación del archivo con la presentación, la factura y el tutor. La presentación quedó pendiente.
- Con una factura de $100, el pago registrado y aprobado seguía en $0 y el saldo en $100 mientras la presentación estaba pendiente.
- El reintento de la misma presentación devolvió el mismo identificador. Una cuenta ajena no pudo consultar el registro del comprobante ni descargar el archivo.
- Una cuenta administrativa autenticada ejecutó la aprobación real `review_transfer`. La presentación pasó a aprobada, el pago acumulado quedó en $25 y el saldo en $75.

Alcance: esta prueba encadena los servicios reales en localhost y utiliza el mismo PDF en toda la operación; **no recorrió el formulario integrado de Expo ni la pantalla administrativa desde el navegador**. La prueba visual anterior solo cubrió el formulario DEMO simulado. Por tanto, la carga y aprobación mediante las interfaces y su reflejo visual siguen pendientes de comprobación de extremo a extremo. La instancia local y sus datos ficticios quedaron disponibles para continuar la revisión. No se alteraron datos institucionales remotos ni se efectuaron commit, push o despliegue.

## Accesos y datos de demostración existentes — 03/11/2026

En Expo Web integrado (`localhost:8086`) se comprobó el acceso rápido y el inicio de sesión real en Supabase para Familia y Estudiante, además del cierre de sesión de Familia. El perfil familiar ve a Emilia y Joaquín; al cambiar de alumno cambia el saldo. Se verificaron los datos DEMO ya existentes de 2027: ambos tienen facturas, cursado, deportes, transporte y comedor. Emilia tiene una factura pagada y otra pendiente con comprobantes; Joaquín tiene dos facturas pendientes. Para verlas hay que filtrar el período 2027 en Cuotas y elegir el ciclo 2027 en Servicios. No se añadieron registros en esta comprobación.

El perfil Estudiante ingresó y no mostró la pestaña Cuotas. La carga y aprobación desde la interfaz integrada, la prueba nativa y las verificaciones restantes siguen pendientes. La exportación web final falló en Metro con `EINVAL` al leer un archivo de `node_modules`; no se considera aprobada. Sin commit ni push.

## Comprobante integrado y Metro — 03/11/2026, continuación

Se completó desde Expo Web local conectado a Supabase remoto y el portal web administrativo la prueba con la familia y el alumno DEMO Joaquín. En la factura DEMO de abril de 2027 se seleccionó comedor, se subió el PDF ficticio `tests/fixtures/transfer.pdf` y se presentó la referencia `DEMO-QA-20261103-100` por $100. El comprobante quedó asociado y la deuda permaneció en $152.000 mientras estaba pendiente. La cuenta administrativa DEMO aprobó esa misma presentación desde Facturación; al actualizar la app, la presentación apareció aprobada, el saldo total quedó en $151.900 y la deuda de comedor pasó de $35.000 a $34.900. Se modificó únicamente esta factura DEMO remota; no hubo transferencia bancaria real.

Metro falló dentro del workspace sincronizado por OneDrive con `EINVAL` al leer `node_modules/abort-controller/browser.js`, marcado como `ReparsePoint`. En una copia temporal fuera de OneDrive, `npm ci` finalizó y `npx expo export --platform web` generó 18 rutas correctamente. Esto ofrece una forma de ejecución alternativa, pero no verifica una solución permanente dentro de la carpeta sincronizada. La instalación informó 30 avisos de npm audit (2 bajos, 23 moderados, 5 altos); no se aplicaron actualizaciones incompatibles automáticamente.

Verificaciones adicionales: web `npm run lint`, `npm test` (23 pruebas) y `npm run build` aprobados; backend 12 pruebas de recordatorios y finanzas aprobadas. Se ejecutó `git fetch` en los tres repositorios. No se realizó commit ni push: sigue pendiente validar una corrección reproducible de Metro dentro de la ubicación solicitada y revisar exhaustivamente el contenido a publicar, incluidos los archivos nuevos y posibles secretos.

## Cierre de Metro y publicación

Se completó `npm ci` en la carpeta original tras detener las instancias Expo duplicadas. Después pasaron lint, TypeScript, 37 pruebas, Expo Doctor 21/21 y exportación web con caché limpia de 18 rutas. No se aplicaron parches manuales a `node_modules`. La comprobación final sustituye el bloqueo de Metro informado anteriormente. El README incluye los comandos de recuperación.

Se revisaron los archivos a publicar y se comprobaron las contraseñas locales y patrones de claves privadas sin encontrar coincidencias en los cambios. Las capturas permanecen locales; no se publican `.env.local`, temporales ni bases. Backend `5d62134` y web `c153484` fueron publicados en `main`, sin desplegar el worker ni programar correos.

## Resultado de los commits y push

Los tres repositorios oficiales recibieron push a `main` correctamente: móvil `4b04ef8` (Completar integración móvil, diseño institucional y cierre de pruebas), backend `5d62134` (Mejorar recordatorios de cuotas y verificar pagos parciales) y web `c153484` (Completar filtros y exportación de reportes financieros). Esta constancia se publica en un commit documental posterior. No se ejecutaron migraciones remotas, despliegues del worker ni activación de correos.
