# Educar para Transformar

Aplicación móvil de un centro educativo destinada a padres, tutores y estudiantes. Reúne la información escolar en un mismo lugar: alumnos vinculados, cuotas, pagos, deportes, comedor y transporte escolar.

El proyecto utiliza **Expo, React Native, Expo Router, TypeScript y JavaScript**. Incluye una integración existente con Supabase y una **demo visual en español**, independiente del backend, para presentar la experiencia de uso con datos ficticios.

## Trabajo realizado

Se desarrolló una demo navegable con identidad educativa: azul principal `#3B82F6`, fondos claros, tarjetas redondeadas, iconos consistentes y navegación inferior adaptada a móviles. Se conservó el stack existente, sin agregar dependencias.

### Perfiles de acceso

| Perfil | Funciones disponibles |
| --- | --- |
| Padre / Tutor | Seleccionar hijos, consultar cuotas y facturas, informar transferencias, ver servicios y transporte, gestionar su perfil. |
| Estudiante | Consultar su información académica básica, servicios, deportes, transporte y perfil. Sin acceso a facturación ni pagos. |

El ingreso a la demo se realiza eligiendo un perfil; **no necesita correo ni contraseña**. Los roles y sus restricciones son una simulación de la interfaz, no un sistema de autorización para producción.

### Pantallas y acciones

- **Inicio:** bienvenida, resumen del alumno, accesos rápidos, saldo pendiente para familias y estado del transporte.
- **Mis hijos:** perfiles de Sofía y Lucas Martínez con curso, nivel y selección. La selección actualiza cuotas, servicios y recorrido.
- **Facturas y cuotas:** filtros de pagadas, pendientes y vencidas; importes, vencimientos y detalle de conceptos.
- **Informar transferencia:** factura, importe total o parcial, fecha y comprobante. Permite elegir un archivo local o usar uno de ejemplo.
- **Servicios educativos:** deportes con profesor y horarios, transporte asignado y comedor con información desplegable.
- **Transporte escolar:** recorrido ilustrado, colectivo, paradas, horario estimado y posición simulada. Un botón avanza la parada actual y permite reiniciar al finalizar.
- **Mi perfil:** información personal, cambio de contraseña simulado y cierre de sesión.

Los comprobantes quedan **pendientes de aprobación**. Informar un pago no reduce la deuda. La demo no transfiere dinero, sube archivos ni modifica contraseñas reales. No utiliza GPS ni geolocalización real.

## Ejecutar la demo

Requisitos: Node.js y npm compatibles con las versiones de Expo del proyecto.

```sh
npm ci
```

Creá `.env.local` en la raíz del repositorio con:

```dotenv
EXPO_PUBLIC_DEMO=true
```

Iniciá la versión web:

```sh
npm run web -- --localhost --port 8081
```

Abrí [localhost:8081](http://localhost:8081) y elegí **Padre / Tutor** o **Estudiante**. Para cambiar de rol, entrá a Mi perfil y cerrá sesión.

Los datos viven en memoria: recargar la página reinicia el estado. Cambiar variables de entorno requiere reiniciar Expo. No hace falta ejecutar `scripts/preview-fixture.mjs` ni configurar Supabase para este modo.

## Organización del trabajo

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `lib/demo.tsx` | Datos ficticios y estado compartido: rol, alumno, comprobantes y parada actual. |
| `lib/demo-transfer.mjs` | Validación de importes, fechas y comprobantes de prueba. |
| `components/demo-ui.tsx` | Colores y componentes compartidos: tarjetas, botones, avatares, selectores y estructura de pantalla. |
| `components/demo-screens.tsx` | Pantallas e interacciones de la demo. |
| `components/demo-tabs.tsx` | Menú inferior según el perfil. |
| `app/` | Rutas de Expo Router y selección entre demo e integración existente. |
| `tests/demo-transfer.test.mjs` | Prueba de pagos parciales y entradas inválidas. |

`EXPO_PUBLIC_DEMO` activa el modo visual. Al desactivarla se utiliza la integración existente; sus componentes y flujos se conservaron.

## Verificaciones realizadas

En el trabajo del 13 de octubre de 2026 se verificó:

- TypeScript sin errores y ESLint sin errores ni advertencias en los archivos revisados.
- **28 tests aprobados**, incluida la validación de importes y fechas del formulario de prueba.
- Navegación web y vista móvil de **390 × 844**.
- Ingreso de ambos perfiles y menú del estudiante sin funciones financieras.
- Cambio de alumno con actualización del colectivo.
- Envío de comprobante parcial pendiente de aprobación, conservando el saldo.
- Avance de la parada del colectivo y cierre de sesión.

Comandos para verificar:

```sh
npm run lint
npx tsc --noEmit
node --test tests/*.test.mjs
```

Para generar una exportación web:

```sh
npx expo export --platform web
```

Esta entrega se comprobó en navegador; no incluye un APK ni pruebas en dispositivos Android o iOS físicos. La exportación web es un comando disponible, no una verificación ejecutada en esta entrega.

## Integración existente con Supabase

### Envío de estado de cuenta de prueba

En el modo integrado, la cuenta familiar dispone de **Mi cuenta → Enviar estado de cuenta**. El botón solicita por correo un PDF informativo con hasta 12 facturas del alumno seleccionado. El PDF no es una factura fiscal. El envío está limitado a la cuenta y dirección de prueba configuradas en el servidor y no procesa la cola de recordatorios automáticos.

El código del botón y de la función `family-statement-test` está integrado en los repositorios; para utilizarlo se debe desplegar la función y configurar `BILLING_DEMO_RECIPIENT`, `BILLING_FROM_EMAIL` y `RESEND_API_KEY` como secretos del servidor. La función se desplegó el 10/11/2026: una solicitud autenticada de la familia de prueba devolvió HTTP 200 y `sent: true`. Resend aceptó el envío; la recepción en la bandeja debe confirmarse. Las claves de servidor no se deben incluir en `EXPO_PUBLIC_*`.

Para ejecutar el modo integrado:

1. Configurá `EXPO_PUBLIC_DEMO=false` en `.env.local`.
2. Usá `.env.example` como referencia y completá la URL pública de Supabase y su clave pública anon/publishable. No utilices una clave privada ni `service_role`.
3. Aplicá y verificá las migraciones financieras del backend en el proyecto hermano `../servidor` antes de conectar familias reales.
4. Ejecutá `npm start` para el entorno nativo o `npm run web` para el navegador.

La integración existente requiere cuentas familiares activas con rol `guardian` o `parent`. La administración de facturación corresponde al portal web. Las credenciales nativas utilizan Expo SecureStore; en web la sesión permanece en memoria.

El repositorio conserva `scripts/preview-fixture.mjs`, una API local de prueba anterior a esta demo. Su cuenta ficticia es `family@example.test` / `FixturePassword12!`; esas credenciales corresponden exclusivamente a ese mecanismo y no se necesitan para la nueva demo.

## Documentación relacionada

- [Registro del trabajo con IA](docs/ai-log.md).
- [Informe de la integración anterior](docs/iteration-2026-10-08.md).
- `../servidor/docs/mobile-billing-deployment.md`: documentación del backend y despliegue financiero, disponible en el proyecto hermano.

El seguimiento GPS, las aprobaciones institucionales reales y la persistencia de datos de la demo quedan fuera del alcance de esta presentación.

## Modo integrado local

La configuración `.env.local` de este workspace apunta al Supabase compartido con clave pública y activa `EXPO_PUBLIC_DEMO=false`. Para volver a la presentación visual, establecer `EXPO_PUBLIC_DEMO=true` y reiniciar Expo; la configuración anterior se conservó en `.env.demo-preintegracion.local`. Consultar `CIERRE_TP_MOVIL_EDUCAR.md` para pruebas reales, límites y preparación EAS.

## Referencia visual

Los cambios de interfaz deben seguir [el Design System móvil](docs/EDUCAR_MOBILE_DESIGN_SYSTEM.md), para los modos integrado y DEMO.

## Recuperar Metro en Windows y OneDrive

Si Metro informa `EINVAL: invalid argument, readlink` o un error de caché, cerrá las instancias de Expo de este proyecto antes de reinstalar. No mantengas varios servidores leyendo la misma instalación durante `npm ci`. Ejecutá `npm ci` y luego `npm run export:web` para reconstruir la caché y verificar las 18 rutas. Para iniciar la presentación con caché limpia, usá `npm run web:limpio -- --port 8081`, o `npx expo start --go --lan --port 8081 --clear` con Expo Go compatible.

Los accesos rápidos de las cuentas de prueba están disponibles en desarrollo mediante `EXPO_PUBLIC_QA_FAMILY_EMAIL`, `EXPO_PUBLIC_QA_FAMILY_PASSWORD`, `EXPO_PUBLIC_QA_STUDENT_EMAIL` y `EXPO_PUBLIC_QA_STUDENT_PASSWORD`. Las cuentas DEMO públicas figuran en `.env.example`; copiá sus valores a `.env.local` para usarlas. Estas variables son visibles para el cliente: utilizá exclusivamente cuentas ficticias. El modo integrado requiere `EXPO_PUBLIC_DEMO=false`.

La cuenta autorizada se fija con `BILLING_TEST_ACCOUNT_EMAIL` (por defecto la cuenta familiar DEMO del proyecto). El envío requiere `BILLING_DELIVERY_MODE=demo` y `BILLING_SEND_ENABLED=true`.
