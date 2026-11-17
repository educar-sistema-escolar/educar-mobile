# Bitácora de uso de inteligencia artificial

**Proyecto:** Educar para Transformar — aplicación web, sistema de gestión y app móvil integrada

**Materia:** Metodología de Sistemas II · TUP 2026

**Grupo 9:** Martín Moschen y Claudio Gómez

**Presentación:** 17 de noviembre de 2026

**Fuente:** Informe de uso de inteligencia artificial, entrega final del Grupo 9.

## 01. Objetivo y alcance

Este informe registra el uso de herramientas de inteligencia artificial durante el desarrollo de Educar para Transformar, con énfasis en la Parte 3 del Trabajo Práctico Integrador: aplicación móvil conectada a la web y al backend institucional. La finalidad es explicar qué se pidió, qué respuesta ofreció la IA, qué se modificó y cómo se validó, en lugar de limitarse a enumerar herramientas.

La consigna exige una bitácora con ocho campos, la relación entre web y móvil, un análisis sobre IA y conocimiento del sistema, una comparación con el desarrollo tradicional y diez preguntas de reflexión crítica. Este documento reúne esos apartados en una entrega independiente.

**Alcance del registro.** La bitácora sintetiza los principales pedidos y resultados del desarrollo. Codex se utilizó para implementar, revisar y probar la solución; Gemini se empleó como apoyo en la organización de requerimientos. Los enunciados de la tabla resumen las tareas tratadas y no pretenden reproducir literalmente todas las conversaciones.

## 02. Relación entre aplicación web y móvil

La plataforma se compone de un sitio y panel de gestión web con React/TypeScript, una aplicación móvil con Expo/React Native y un Supabase compartido. El backend centraliza PostgreSQL, autenticación, políticas RLS, funciones RPC y almacenamiento privado. Esta arquitectura mantiene una única fuente de datos para alumnos, responsables, servicios, facturas y comprobantes.

| Componente | Función |
|---|---|
| Web / administración | Alta y gestión académica, deportes, transporte, comedor, precios, facturación, revisión de transferencias y reportes. |
| Móvil / familia | Selección de hijos, consulta de cuotas y deudas, facturas, transferencias, comprobantes y servicios. |
| Móvil / estudiante | Consulta de cursado y servicios personales, sin permisos para gestionar facturación. |
| Backend compartido | Control de roles, asociación familiar, validaciones de inscripciones, estados de pago, RLS, RPC y Storage. |

La sincronización se produce mediante nuevas consultas al mismo backend. No se presupone actualización instantánea. La aprobación de una transferencia en Administración modifica el saldo que ve la familia cuando la aplicación vuelve a consultar.

## 03. Herramientas y responsabilidades

**Codex — implementación y verificación.** Se utilizó como asistente técnico para continuar el proyecto existente, integrar módulos con Supabase, construir componentes, localizar errores, preparar tests, revisar permisos y mejorar el diseño. Sus propuestas se contrastaron con el código, migraciones y reglas institucionales.

**Gemini — orquestación de requerimientos.** Se incorporó como herramienta de apoyo para descomponer requerimientos, ordenar dependencias, contrastar criterios de aceptación y organizar bloques de trabajo. La verificación del código, la base de datos y las pruebas permaneció bajo responsabilidad del equipo.

**Martín y Claudio — decisiones y aceptación.** El equipo definió prioridades, límites funcionales, responsabilidades, estructura de la solución y criterios de prueba. Ningún texto generado por IA se consideró evidencia de funcionamiento por sí mismo.

## 04. Criterio de registro

- **Prompt utilizado:** síntesis breve del objetivo de cada interacción.
- **¿Funcionó?:** «Sí», «Parcial» o «Sí (DEMO)», diferenciando resultados probados y apoyos de análisis.
- **Resultado:** describe resultados técnicos o documentales; no atribuye pruebas que no fueron realizadas.

### Intervenciones representativas

**Permisos y datos.** En los primeros recorridos se detectó que algunas relaciones del docente no eran visibles desde una consulta directa por RLS. La corrección consistió en reutilizar una RPC autorizada en lugar de abrir permisos generales o duplicar información.

**Cuotas y pagos.** Las propuestas debían respetar el proceso administrativo: el tutor informa una transferencia y adjunta el archivo; la deuda permanece sin cambios hasta que una cuenta autorizada la aprueba. Esto se verificó con un caso DEMO de pago parcial.

**Correos y automatización.** La implementación del trabajador incluyó relectura del saldo, auditoría de intentos, protección de duplicaciones y pruebas controladas. En una etapa posterior se comprobó la entrega DEMO de un aviso de deuda y uno de cierre con PDF, sin enviar mensajes a familias reales.

**Orquestación con Gemini.** Su función fue apoyar la organización y secuenciación de los requerimientos. Por ejemplo, los deportes requieren considerar nivel, horarios y cupos, mientras que los procesos financieros dependen de permisos, conceptos, comprobantes y revisión administrativa. La implementación y las pruebas se registraron por separado mediante Codex y las herramientas del proyecto.

### Secuencia de trabajo del equipo

1. Identificar el requerimiento en el TP y el Plan de Trabajo.
2. Dividirlo en decisiones, tareas y criterios de aceptación.
3. Solicitar apoyo de IA para propuestas de implementación o coordinación.
4. Comprobar las propuestas contra el repositorio y la base real.
5. Ejecutar pruebas, corregir diferencias y documentar el resultado.

## 05. Bitácora de uso de IA

| Nº | Problema | Prompt utilizado | Herramienta de IA | Respuesta de IA | ¿Funcionó? | Modificaciones realizadas | Resultado |
|---|---|---|---|---|---|---|---|
| 1 | Integración móvil inicial | Completar la app según el plan y conectarla con web. | Codex | Reutilizar Supabase, Auth y esquema financiero. | Parcial | Ajustes de permisos, flujos y pruebas. | Integración consolidada en iteraciones posteriores. |
| 2 | Demo para presentación | Crear demo navegable ficticia separada del modo real. | Codex | Perfiles, facturas y servicios simulados. | Sí | Restringir finanzas del estudiante; conservar estado pendiente. | Demo visual y 28 tests documentados. |
| 3 | Servicios y permisos | Completar roles, hijos, deportes y transporte. | Codex | Consultas Supabase; identificó relación docente oculta por RLS. | Sí | Reutilizar RPC autorizada `list_sport_request_options`. | Consulta de servicios y familias comprobada. |
| 4 | Comprobantes y saldos | Probar pagos parciales, PDF, duplicados y acceso ajeno. | Codex | Storage privado, RPC y aprobación administrativa. | Sí | Aislamiento, idempotencia, tests integrados. | Saldo se reduce solo tras aprobación. |
| 5 | Reportes económicos | Completar filtros web de ingresos y servicios del TP. | Codex | Reportes por fechas, alumno, deporte y recorrido; CSV. | Sí | Filtros, total de ingresos y protección del CSV. | Pruebas web y build documentados. |
| 6 | Correos mensuales | Preparar avisos de día 20 y cierre con PDF; luego activar DEMO. | Codex | Worker con auditoría, reconsulta, `dry_run` y Resend. | Sí (DEMO) | Configurar Cron, secretos, pruebas a correo autorizado. | Dos correos recibidos y un intento por mensaje; sin familias reales. |
| 7 | Identidad y claridad | Crear y respetar un Design System institucional móvil. | Codex | Tokens azules y componentes compartidos. | Sí | Ajustar textos, filtros, botones y navegación. | Revisión visual en tamaños móviles. |
| 8 | Expo / Metro | Diagnosticar styleq y EINVAL sin alterar lógica. | Codex | Aisló problemas de instalación y caché. | Sí | `npm ci`, limpieza de caché y exportación reproducible. | 18 rutas exportadas; tests aprobados. |
| 9 | Mejora visual | Elevar el diseño evitando apariencia genérica. | Codex | Portada escolar, jerarquía de tarjetas y perfil. | Parcial | Revisar Inicio, Cuotas y selector de alumnos. | Pantallas web observadas; revisión nativa no acreditada en fuente. |
| 10 | Prioridad de RF | Orquestar RF-10 y RF-11: dependencias, validaciones y pruebas. | Gemini | Síntesis de tareas para deportes y transporte. | Parcial | Criterios revisados con las reglas de negocio del proyecto. | Apoyo al desglose de requisitos deportivos y transporte. |
| 11 | Flujo académico | Ordenar RF-01 y RF-20: solicitudes, permisos y duplicados. | Gemini | Secuencia sugerida de criterios de aceptación. | Parcial | Requisitos contrastados con los permisos familiares y el cursado. | Apoyo a la organización del flujo académico. |
| 12 | Ampliación móvil | Coordinar requisitos M-02 a M-09 entre clientes y backend. | Gemini | Desglose de facturación, servicios, reportes y correo. | Parcial | Dependencias ordenadas en torno al backend compartido. | Apoyo en la coordinación de la ampliación móvil. |

## 06. IA vs. conocimiento del sistema

Una respuesta puede ser correcta como código y, aun así, incorrecta para Educar. La IA puede proponer una tabla duplicada de facturas, saltarse la revisión administrativa de una transferencia o consultar alumnos sin verificar el vínculo familiar. También puede sugerir tecnologías o dependencias incompatibles con la versión de Expo utilizada.

La solución exigió comprender el contexto de una institución educativa; la arquitectura de web, móvil y Supabase; la base de datos; los requisitos y reglas de negocio; los permisos y las tecnologías. Por eso el código generado se contrastó con migraciones, funciones RPC, RLS, datos de demostración y resultados de pruebas.

**Ejemplo comprobable:** una presentación de $100 en una factura DEMO de $152.000 no modificó la deuda mientras estuvo pendiente. Después de la aprobación administrativa, el saldo pasó a $151.900. La validez de la implementación depende de esa regla institucional, no solo de que el formulario permita adjuntar un archivo.

## 07. Desarrollo tradicional vs. asistido por IA

| Aspecto | Sin IA | Con IA |
|---|---|---|
| Generación de código | Implementación manual desde el inicio. | Codex aporta borradores y pruebas; se revisan e integran. |
| Tiempo | Se planifica y escribe manualmente cada bloque. | Acelera propuestas, aunque exige depuración; sin medición de horas. |
| Comprensión | Cada decisión obliga a investigar el código. | La propuesta necesita lectura y justificación por el equipo. |
| Errores | Depuración y tests manuales. | Sugiere casos y tests, pero no impide fallos de entorno. |
| Documentación | Redacción y organización manuales. | Ayuda a estructurar guías, informe y bitácora. |
| Aprendizaje | Consulta de documentación y práctica directa. | Explicaciones rápidas que hay que comprobar. |
| Integración | Análisis de contratos entre módulos. | Orquestación con Gemini y propuestas de Codex; verificación necesaria. |
| Seguridad | Diseño explícito de políticas y controles. | Ayuda a plantear casos; no reemplaza RLS ni pruebas por rol. |
| Mantenimiento | Código mantenido desde decisiones propias. | Riesgo de complejidad si no se simplifica lo generado. |
| Calidad | Depende de pruebas y criterio técnico. | Puede mejorar rapidez y cobertura; requiere aceptación humana. |

## 08. Reflexión crítica: diez respuestas

1. **¿La IA redujo realmente el tiempo de desarrollo?** Agilizó la creación de propuestas, tests y documentación. No se midió el tiempo equivalente sin IA, por lo que no corresponde afirmar un porcentaje de ahorro. Parte del tiempo ganado se destinó a integrar, revisar y corregir.
2. **¿En qué tareas resultó más útil?** En la lectura del proyecto existente, desarrollo de formularios y consultas, test de permisos, reportes financieros, diseño móvil, documentación y organización de actividades entre requerimientos.
3. **¿En qué tareas produjo errores?** En interpretaciones iniciales del modelo de datos y restricciones de acceso, detalles de presentación responsive y problemas al ejecutar Expo/Metro en el entorno local.
4. **¿Qué tipo de errores fueron más frecuentes?** Se repitieron problemas de integración entre capas, dependencias y configuración, además de ajustes de interfaz. No se llevó una estadística exhaustiva para ordenar su frecuencia numéricamente.
5. **¿Fue necesario modificar código generado por IA?** Sí. Se ajustaron consultas RPC, acceso a alumnos vinculados, estados de facturas, validación de archivos, protección frente a envíos duplicados, textos, componentes y pruebas.
6. **¿La IA comprendió correctamente la base de datos?** No debía asumirse. Las relaciones se cotejaron con PostgreSQL/Supabase, migraciones y políticas RLS. La relación con docentes y el aislamiento entre familias exigieron validaciones reales.
7. **¿Comprendió correctamente las reglas de negocio?** Fue necesario explicitarlas: máximo dos deportes sin superposición, cuatro recorridos, permisos por rol y saldo descontado solo tras aprobación. Los tests sirvieron para comprobar que se respetaran.
8. **¿Qué riesgos identificaron?** Exposición de datos de menores, acceso indebido entre familias, duplicación o aprobación incorrecta de pagos, correos repetidos, filtración de secretos y confundir simulaciones con pruebas reales.
9. **¿Qué conocimientos necesitó el equipo para validar las respuestas?** TypeScript, React, React Native, Expo, Supabase Auth, PostgreSQL, RLS, RPC, Storage, Git, pruebas, seguridad, arquitectura cliente-servidor y comprensión de los requerimientos.
10. **¿La IA puede reemplazar el conocimiento del programador?** No. Las herramientas ayudaron a producir alternativas y organizar tareas, pero la responsabilidad de definir, integrar, probar y justificar el software corresponde a Martín y Claudio.

## 09. Evidencias, límites y conclusión

**Evidencias registradas:** demo visual con 28 tests; etapa integrada con 37 pruebas móviles, verificación de tipos y lint; exportación web de 18 rutas; 23 pruebas web; validación de pagos parciales y seguridad; ejecución DEMO de recordatorios con Resend que entregó dos correos a una cuenta controlada, incluyendo un PDF, y un Cron sin duplicaciones observadas.

**Alcance de las verificaciones:** Las pruebas de navegador web y de Expo Go cubren entornos distintos. Los correos se probaron mediante una cuenta DEMO autorizada, sin habilitar envíos a familias reales. El PDF enviado se generó como estado de cuenta institucional, no como factura fiscal certificada. Gemini se empleó como apoyo de análisis, mientras que las verificaciones técnicas se registraron en los informes del sistema.

**Conclusión:** Codex se utilizó principalmente para implementación, integración y pruebas; Gemini se incorporó como herramienta de apoyo para la orquestación de algunos requerimientos. El valor de ambas herramientas dependió de la capacidad del grupo para darles contexto, revisar las propuestas y comprobar resultados concretos.

### Tres aprendizajes concretos

1. **Reglas y permisos antes que pantallas.** La sección de deportes o facturas puede verse bien y responder a los clics, pero no está terminada si un tutor puede consultar registros ajenos. Las comprobaciones de RLS y de perfiles separados fueron más importantes que una captura estática.
2. **Simulación y funcionamiento real no son equivalentes.** La demo visual se utilizó para comunicar la experiencia, mientras que la aplicación integrada consultó Supabase. En los informes se distinguen las pruebas con fixtures, las llamadas a API, el navegador integrado y Expo Go. Cada una aporta un tipo de evidencia diferente.
3. **Automatizar requiere controlar efectos.** En recordatorios, no bastaba con redactar dos correos. Había que identificar destinatarios, validar saldos, programar el trabajo, guardar el resultado e impedir reenvíos. La prueba DEMO con Resend comprobó la entrega, pero mantener el límite de destinatarios es esencial hasta la aprobación institucional.

### Fuentes y trazabilidad

- TP Integrador de Metodología de Sistemas II, Parte 3 (consigna y estructura del informe).
- TP Integrador Grupo 9 consolidado: secciones 8 a 10 (bitácora, comparación y reflexión crítica).
- Repositorio educar-mobile: [docs/ai-log.md](docs/ai-log.md), [QA_FINAL_EDUCAR_MOBILE.md](QA_FINAL_EDUCAR_MOBILE.md), [CIERRE_DEFINITIVO_MOVIL.md](CIERRE_DEFINITIVO_MOVIL.md).
- Repositorio educar-servidor: `docs/mobile-billing-deployment.md` y reportes del worker.
- Evidencia del equipo sobre la prueba DEMO de correos mediante Supabase y Resend.
