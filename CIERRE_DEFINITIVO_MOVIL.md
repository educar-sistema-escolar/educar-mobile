# Cierre de Educar Mobile — estado al 03/11/2026

El detalle y las evidencias de etapas anteriores están en `QA_FINAL_EDUCAR_MOBILE.md`, `CIERRE_TP_MOVIL_EDUCAR.md` y `REVISION_DESIGN_SYSTEM_MOVIL.md`.

- **Acceso integrado:** Familia y Estudiante ingresaron desde Expo Web; Familia seleccionó ambos hijos. El estudiante no ve Cuotas.
- **Comprobantes:** carga real del PDF de prueba desde Expo Web, asociación y aprobación de una presentación DEMO desde el portal web. La factura del alumno DEMO Joaquín pasó de $152.000 a $151.900 después de aprobar $100; permaneció sin cambios mientras la presentación estaba pendiente. La referencia es `DEMO-QA-20261103-100` y el registro DEMO quedó en Supabase remoto.
- **Metro (estado anterior):** instalación limpia con `npm ci` y exportación web de 18 rutas aprobadas en una copia temporal fuera de OneDrive. Dentro del workspace sincronizado se observó `EINVAL` en un archivo de `node_modules` marcado como reparse point; falta verificar una corrección permanente en esa ubicación. La instalación informó 30 avisos de npm audit.
- **Pruebas anteriores del móvil:** lint, TypeScript, 37 pruebas y Expo Doctor 21/21 aprobados. Web: 23 pruebas y lint aprobados. Backend: 12 pruebas de recordatorios y PostgreSQL aprobadas; el worker usa dobles y no se enviaron correos reales.
- **Expo Go:** no se probó en Android. En un entorno con Expo Go compatible ejecutar `npx expo start --go --lan --port 8081`, con variables públicas de Supabase configuradas y teléfono en la misma red. La app web local no constituye prueba nativa.
- **Recordatorios:** migración y worker preparados sin despliegue ni programación activa comprobada. Faltan proveedor, programador y validación del calendario de feriados para envíos reales.
- **Diseño:** referencia permanente en `docs/EDUCAR_MOBILE_DESIGN_SYSTEM.md`; alcance visual y capturas existentes en `REVISION_DESIGN_SYSTEM_MOVIL.md`.
- **Publicación:** backend `5d62134` y web `c153484` publicados en `main`. La publicación móvil se registra al finalizar. Las capturas permanecen locales para evitar publicar evidencias sin una revisión de privacidad individual.

Para presentar la versión web integrada, ejecutar Expo con las variables públicas configuradas, ingresar con la cuenta de prueba y consultar 2027 en Cuotas y Servicios. Los accesos rápidos locales de desarrollo dependen de variables ignoradas en `.env.local`; nunca incluirlas en commits ni builds distribuidos.

## Validación final en la carpeta original

Se cerraron los servidores Expo duplicados y se reconstruyó la caché. Después se ejecutó `npm ci` dentro de `educar-mobile`, sin modificar manualmente `node_modules`. Pasaron lint, TypeScript, 37 pruebas, Expo Doctor 21/21 y `npm run export:web` (18 rutas). Se agregaron `web:limpio` y `export:web` para reconstruir la caché de manera reproducible. El error EINVAL no volvió a ocurrir en estas comprobaciones. OneDrive puede volver a alterar el estado local: el README documenta la recuperación.

La revisión de los cambios no encontró las contraseñas locales ni claves privadas. `.env.local`, bases, temporales y exportaciones quedan fuera de Git. Permanecen los avisos de dependencias ya documentados y la prueba física de Expo Go pendiente.
