# Informe de uso de IA — Grupo 9

Martín Moschen y Claudio Gómez · Metodología de Sistemas II · TUP 2026

**Borrador para completar y validar por el equipo.** No se debe presentar como testimonio personal sin revisión.

## Relación entre web y móvil

La web preexistente administra alumnos, servicios, inscripciones y reportes. El repositorio también incluye una pantalla administrativa de facturación para configurar valores, emitir facturas, revisar transferencias y consultar reportes. La app móvil incorpora consultas por alumno, facturas, conceptos, presentaciones de transferencias y servicios; además contiene una demo independiente con datos ficticios. La implementación integrada usa el mismo Supabase: autenticación, servicios HTTPS, PostgreSQL y Storage privado. Las migraciones del backend definen facturas, conceptos, comprobantes, revisión y recordatorios; su existencia en el repositorio no demuestra que estén aplicadas en el entorno real. Ambos clientes consultan la misma fuente, pero la actualización visible depende de volver a consultar o recargar: no se ha verificado sincronización en tiempo real.

## Bitácora

| Nº | Problema | Prompt utilizado | Herramienta de IA | Respuesta de IA | ¿Funcionó? | Modificaciones realizadas | Resultado |
|---|---|---|---|---|---|---|---|
| 1 | Acceso móvil de estudiantes | Pedido actual: completar autenticación, roles y servicios integrados | Codex | Adaptación del ingreso a perfiles activos de estudiante y restricciones de interfaz financiera | Parcial: pruebas automatizadas y TypeScript aprobados; integración real pendiente | Cambios en autenticación, selección de alumno, inicio y navegación | Pendiente de validación contra Supabase y Android |
| 2 | Correos de recordatorios con texto insuficiente | Pedido actual: recordatorios con alumno, período y conceptos | Codex | Texto en español con detalle por alumno y exclusión de conceptos saldados en avisos de deuda | Parcial: pruebas con proveedor y base simulados | Ajuste de contenido y prueba del worker | No se verificó envío real |
| 3 | [Completar por el equipo] | [Prompt real] | [Herramienta] | [Respuesta] | [Resultado comprobado] | [Cambios] | [Evidencia] |

La bitácora histórica del repositorio `educar-mobile/docs/ai-log.md` registra una iteración de octubre; el equipo debe comprobar sus datos antes de incorporarlos como experiencia propia. No se dispone del texto literal de todos los prompts anteriores.

## IA y conocimiento del sistema

Una propuesta técnicamente válida puede usar relaciones, campos o permisos que no representan la base real, duplicar facturas o permitir acceso entre familias. Hay que contrastarla con migraciones, RLS, contratos y reglas del negocio; probarla con roles y datos adecuados, y verificar su compatibilidad con React Native, Expo y el backend compartido. Un resultado que compila no demuestra autorización ni consistencia financiera.

## Comparación: desarrollo tradicional y asistido

| Aspecto | Sin IA | Con IA | Evidencia / validación del equipo |
|---|---|---|---|
| Generación de código | Implementación manual | Propuestas a revisar y adaptar | Completar |
| Tiempo | Medición necesaria | Medición necesaria | No hay tiempos comparables documentados |
| Comprensión | Lectura y análisis del código | La propuesta también requiere lectura | Completar |
| Detección de errores | Revisión y pruebas | Puede sugerir casos y errores | Verificar con pruebas reales |
| Documentación | Elaboración manual | Borradores revisables | Completar |
| Aprendizaje | Investigación y práctica | Explicaciones que deben contrastarse | Completar |
| Integración | Contratos analizados por el equipo | La propuesta puede desconocer contratos | Revisar migraciones y RLS |
| Seguridad | Revisión de permisos | Las sugerencias no demuestran seguridad | Probar acceso entre familias |
| Mantenimiento | Responsabilidad del equipo | Código generado necesita comprensión | Completar |
| Calidad | Requiere validación | Requiere la misma validación | Completar |

## Reflexión crítica: respuestas a validar por Martín y Claudio

1. **¿Redujo el tiempo?** No hay mediciones comparables documentadas; completar con experiencia verificable.
2. **¿En qué fue útil?** Puede ayudar a localizar contratos, proponer código y pruebas; validar con la experiencia del equipo.
3. **¿En qué produjo errores?** Registrar ejemplos reales, sus correcciones y evidencia.
4. **¿Qué errores fueron más frecuentes?** Completar a partir de los casos registrados, sin extrapolar.
5. **¿Se modificó el código generado?** Documentar cambios concretos que el equipo haya revisado.
6. **¿Comprendió la base?** Las propuestas deben contrastarse con el esquema desplegado y sus políticas; completar con evidencia.
7. **¿Comprendió las reglas?** Es necesario probar los límites de deportes y la aprobación de pagos; completar con resultados.
8. **¿Qué riesgos identificaron?** Acceso indebido a menores, importes incorrectos, duplicados, envío equivocado y dependencia de código no comprendido.
9. **¿Qué conocimientos se necesitaron?** Modelo de datos, SQL/RLS, autenticación, reglas financieras, React Native y pruebas.
10. **¿Reemplaza al programador?** No: el equipo debe entender, validar y asumir responsabilidad por diseño, seguridad y funcionamiento.

## Trazabilidad del plan

| Etapa original | Alcance previsto | Estado histórico |
|---|---|---|
| Sprint 1 | Deportes y transporte: RF-10 y RF-11 | Validar con el equipo y el tablero |
| Sprint 2 | Alumnos y cursado: RF-01 y RF-20 | Validar con el equipo y el tablero |
| Sprint 3 | Profesores y reportes: RF-05 y RF-22 | Validar con el equipo y el tablero |
| Ampliación Parte 3 | Móvil, facturación compartida, comprobantes, recordatorios e informe de IA | En desarrollo; pruebas integrales pendientes |

Hitos indicados en la consigna: preparación para testing el 11/11/2026; informe de IA el 17/11/2026.

## Ampliación móvil registrada el 3 de noviembre de 2026

| Tarea | Resultado verificable | Prueba o pendiente |
|---|---|---|
| Servicios y cursado | Vista por alumno y ciclo; solicitudes de deportes y transporte mediante RPC y estados compartidos | Tests de contrato y PostgreSQL aislado aprobados; navegador integrado contra proyecto real pendiente |
| Facturación | Detalle de saldo, actualización y prevención de doble pulsación | Tests de cliente y PostgreSQL aislado aprobados; Storage real pendiente |
| Reportes | Filtros por alumno, estado, año y servicio, CSV y total de ingresos | 23 tests web y build; falta probar nueva versión en navegador con datos reales |
| Recordatorios | Auditoría y recálculo antes de envío, modo de prueba, PDF y textos en español | 11 tests con dobles y SQL local; despliegue, calendario, programación y proveedor pendientes |
| EAS | Perfil APK de prueba y paquete configurados | Falta iniciar sesión, vincular proyecto, construir e instalar |

**Bitácora de esta sesión.** Prompt verificable: «SI no funciona supabase usa el navegador integrado». Herramienta: Codex. Respuesta: se abrió el proyecto institucional en el navegador y se verificaron RLS, bucket y calendario mediante consultas de lectura. Resultado: confirmado el bucket privado y ausencia de `pg_cron` y feriados; el navegador quedó deshabilitado durante la continuación. Martín y Claudio deben confirmar qué pasos realizaron personalmente y añadir sus propios prompts y resultados, sin atribuirse experiencias no documentadas.
