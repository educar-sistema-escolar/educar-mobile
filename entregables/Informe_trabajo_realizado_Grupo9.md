# Informe de trabajo realizado — aplicación móvil Educar para Transformar

**Trabajo Práctico Integrador, Parte 3 · Metodología de Sistemas II · TUP 2026**
**Grupo 9: Martín Moschen y Claudio Gómez**
**Fecha de corte: 3 de noviembre de 2026**

Este informe reúne el trabajo de revisión, implementación y pruebas realizado en la carpeta `APP-MOVIL`. La app quedó configurada localmente para consultar el Supabase compartido con la web. Hay funcionalidades comprobadas mediante acceso real a la API, pero la entrega completa todavía requiere pruebas visuales en Expo Go y la configuración del servidor de correo.

## 1. Material y punto de partida

Se revisaron los repositorios locales oficiales `educar-mobile`, `educar-cliente` y `educar-servidor`, sus migraciones, servicios, pantallas, pruebas y documentación. Se consultaron el enunciado `TP-Metodologia-3.pdf`, ubicado en Descargas, el documento `Plan de Trabaj1.docx` y los informes anteriores de QA.

Existían una demo móvil visual independiente, integración parcial con Supabase, facturación y transferencias en el backend, un módulo administrativo de facturación en la web y una función de recordatorios. Se trabajó sobre estas bases y se conservaron los cambios locales ya presentes. La demo visual usa datos ficticios y está separada del modo integrado.

## 2. Aplicación móvil

- Se completaron ajustes de acceso y navegación para perfiles de padre/tutor y estudiante, con sesión nativa en SecureStore y validación del rol mediante el perfil del servidor. El estudiante no recibe navegación de pagos. La seguridad real depende de las políticas y funciones del backend.
- Se reforzó la selección de alumno para evitar mostrar resultados de una sesión o hijo anterior durante cargas y cambios de identidad.
- Se incorporaron filtros de facturas por fecha y estado; detalle por concepto de importes facturados, aprobados y pendientes; y actualización manual de saldos. Las transferencias pendientes no reducen la deuda.
- Se ajustó el formulario de transferencia para validar importes y tipo/tamaño del comprobante, impedir una doble pulsación y adjuntar nuevos archivos a presentaciones pendientes. Usa la RPC y el bucket existentes.
- Se amplió la consulta de servicios por ciclo: deportes, grupo, nivel, profesor y horario; transporte, recorrido y parada; comedor y uso informado; y cursado. La pantalla de familia permite solicitar deportes o transporte a través de las mismas RPC de la web, que aplican las reglas del servidor y dejan la solicitud pendiente de revisión.
- Se corrigió la visualización del profesor: la relación directa queda oculta por RLS y ahora se utiliza la RPC autorizada `list_sport_request_options`.
- Se hicieron ajustes de color, áreas seguras, teclado, etiquetas y controles de carga. La demo GPS sigue identificada como simulación.

La inscripción de transporte se consulta por **ciclo anual**; las facturas conservan los valores de sus períodos. No se probó una modificación mensual de transporte de extremo a extremo.

## 3. Web y backend compartidos

En la pantalla administrativa de facturación se agregaron filtros de reportes por alumno, estado, año, deporte, nivel, profesor, horario y recorrido; total de ingresos aprobados; y exportación CSV con protección contra fórmulas. Los filtros de servicio se aplican al detalle de servicios; el período debe consultarse nuevamente al cambiar fechas. No se modificaron los reportes académicos.

En el backend local se extendió el worker existente de recordatorios con registro de intentos y errores, reconsulta del vínculo y de la deuda antes de enviar, y modo `dry_run` que genera previsualización sin declarar correos enviados. Se preparó la migración `20261103191021_billing_reminder_delivery_audit.sql` para esos campos y la función de revalidación. La migración **no se aplicó al proyecto remoto** y el worker nuevo no se desplegó.

Los correos previstos incluyen el detalle del alumno y período; el de cierre adjunta un PDF de estado de cuenta. El documento generado no se ha validado como factura fiscal. No se enviaron correos reales.

## 4. Integración real con Supabase

Se usó el proyecto compartido ya configurado para la web. Mediante cuentas DEMO existentes, y sin insertar ni modificar registros, se comprobó:

| Caso | Resultado |
|---|---|
| Ingreso y cierre de padre/tutor y estudiante | Respondieron correctamente mediante Supabase Auth. |
| Hijos vinculados | La cuenta familiar obtuvo dos alumnos. |
| Facturas y transferencias | Se consultaron dos facturas por hijo y dos transferencias. |
| Comprobantes | Dos PDF existentes se descargaron mediante enlaces firmados. |
| Servicios 2027 | Se obtuvieron deportes, profesor, horarios, transporte, comedor y cursado. |
| Acceso a un alumno ajeno | La consulta familiar devolvió cero registros, también para sus facturas. |
| Facturas como estudiante | La consulta devolvió cero registros. |

Además, desde el panel remoto se comprobó que las tablas financieras y de solicitudes inspeccionadas tenían RLS activa, y que el bucket de comprobantes era privado, aceptaba PDF/JPG/PNG y tenía límite de 5 MB. Estas consultas no reemplazan una prueba exhaustiva de todas las políticas ni prueban la carga de un archivo nuevo.

## 5. Pruebas y resultados

- **Móvil:** 34 pruebas automatizadas ejecutadas en conjunto y una prueba adicional específica para resolver el profesor mediante la RPC; TypeScript y lint aprobados. Se exportó la aplicación web de Expo integrada.
- **Web:** 23 pruebas automatizadas, build y lint aprobados. Los filtros financieros nuevos aún no se validaron visualmente contra el entorno real.
- **Backend:** 11 pruebas del worker con dobles de red, base y PDF; no se enviaron mensajes. En PostgreSQL 18 local con fixtures se probaron aislamiento, pago parcial, duplicados, concurrencia, cupos, horarios, feriados, revocación y revalidación de deuda. Este entorno no reproduce la plataforma Supabase completa.
- **Web institucional:** se abrió el sitio y se observó la pantalla de facturación existente. No se guardaron capturas de esta etapa. El navegador integrado quedó deshabilitado durante la continuación, por lo que no se verificó la nueva interfaz local en él.
- **Expo Go:** se preparó el arranque para el modo integrado; al momento de redactar, falta abrirlo en un teléfono y verificar navegación, autenticación, teclado, carga y descarga de comprobantes y red. La exportación web no constituye una prueba Android nativa.

## 6. Recordatorios automáticos

El último día hábil se calcula considerando fines de semana y la tabla de feriados institucional. La consulta remota mostró el calendario vacío y `pg_cron` sin instalar; no se pudo descartar la existencia de otro programador externo. Se necesita mantener los feriados, configurar el programador, desplegar el worker y su migración tras validación, y disponer de remitente y credenciales del proveedor. Las claves permanecen del lado servidor.

El modo de prueba y las pruebas automatizadas no representan envío real. La deuda se vuelve a consultar antes del envío; un pago aprobado después de esa lectura puede no reflejarse en el mensaje ya preparado. Detalles operativos en `educar-servidor/docs/mobile-billing-deployment.md`.

## 7. Demostración con Expo Go

La decisión actual del equipo es mostrar la app con Expo Go; **no se requiere generar un APK**. En `educar-mobile`, ejecutar `npm ci` y luego `npx expo start --go --lan --port 8081`. Abrir Expo Go en un teléfono compatible con SDK 57 y escanear el código QR; teléfono y PC deben poder comunicarse en la red. La configuración local existente usa Supabase real y `EXPO_PUBLIC_DEMO=false`. Para la demo visual sin backend, cambiar a `true` y reiniciar Expo. La configuración visual anterior se guardó en `.env.demo-preintegracion.local`.

Expo Go debe coincidir con el SDK del proyecto; consultar [la guía oficial de compatibilidad de Expo Go](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) si aparece un error de versión. Recuperación de contraseña por enlace y selección de archivos también requieren prueba en el teléfono.

## 8. Plan de Trabajo e informe de IA

Se mantuvieron las etapas originales del Grupo 9: Sprint 1, deportes y transporte (RF-10/RF-11); Sprint 2, alumnos y cursado (RF-01/RF-20); Sprint 3, profesores y reportes (RF-05/RF-22). La Parte 3 móvil figura como ampliación posterior. El informe académico y la tabla editable de bitácora se encuentran en `educar-mobile/entregables/Informe_IA_Grupo9.md`; Martín y Claudio deben validar las respuestas personales y completar su experiencia real. No se inventaron tiempos ni testimonios.

El token de GitHub disponible no tenía permiso `read:project`; por ello no se verificó ni actualizó GitHub Projects. Los hitos de la consigna son el 11/11/2026 para testing y el 17/11/2026 para el informe de IA.

## 9. Pendientes para la entrega

1. Abrir la app en Expo Go y recorrer ambos perfiles; probar teclado, tamaños, red y recuperación de contraseña.
2. En un entorno de prueba autorizado, registrar una transferencia con PDF o imagen, agregar otro comprobante, revisar desde Administración y contrastar el saldo entre web y móvil; probar duplicados y acceso a archivos de otra familia.
3. Verificar visualmente los filtros y CSV del reporte financiero nuevo.
4. Revisar y aplicar la migración local en un entorno aislado, configurar proveedor y programador, completar feriados y ejecutar una prueba controlada de ambos recordatorios.
5. Guardar capturas y validar el informe académico y la bitácora con el equipo.

## 10. Ubicación de los cambios

- Móvil: `educar-mobile/app`, `lib`, `components`, `tests`, `app.json`, `eas.json`, `README.md` y este directorio de entregables.
- Web: `educar-cliente/src/pages/admin/BillingPage.tsx`, `src/features/admin/services/billingReport.ts` y su prueba.
- Backend: `educar-servidor/supabase/functions/billing-reminders/index.ts`, la migración local indicada y sus pruebas y documentación.
- Trazabilidad y estados por requerimiento: `educar-mobile/CIERRE_TP_MOVIL_EDUCAR.md`.

Los cambios están en los repositorios locales para revisión. No se hicieron commits, push, merges ni despliegues públicos.

## 11. Ajuste de compatibilidad para Expo Go

Después de acordar la demostración con Expo Go se ejecutó `expo-doctor`. Se alinearon cinco paquetes con los parches recomendados de Expo SDK 57 y se retiraron dos opciones obsoletas del archivo `app.json`. Tras el ajuste, `expo-doctor` aprobó **21 de 21 controles**; se repitieron **35 pruebas móviles**, TypeScript y lint, con resultado satisfactorio. La instalación informó 30 vulnerabilidades de dependencias (2 bajas, 23 moderadas y 5 altas); requieren análisis específico antes de aplicar correcciones automáticas que podrían alterar versiones. La prueba en teléfono sigue pendiente.
