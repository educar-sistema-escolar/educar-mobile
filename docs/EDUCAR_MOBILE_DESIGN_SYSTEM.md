# EDUCAR PARA TRANSFORMAR — DESIGN SYSTEM MÓVIL

**Versión:** 1.0 · **Proyecto:** Grupo 9 — Metodología de Sistemas II · **Stack:** React Native + Expo Router + TypeScript

## 1. Propósito y criterio de implementación

La app móvil debe sentirse parte de **Educar para Transformar**: educativa, institucional, moderna, clara, confiable y sencilla para familias y estudiantes. **Azul institucional, fondos claros y superficies blancas** son la base. No deben coexistir pantallas con lenguajes visuales distintos.

Este documento fija la guía de diseño para **todos los modos y módulos**, incluidos los componentes DEMO y los conectados con Supabase. **No implica rehacer pantallas que ya funcionan:** Codex debe examinar primero los componentes existentes, consolidar los tokens y corregir diferencias concretas. No debe tocar permisos, RPC ni lógica de cobro para aplicar una mejora visual.

### Origen de los tokens

Los colores base y la mayor parte de los tamaños se tomaron de `educar-mobile/components/demo-ui.tsx` en el repositorio existente. Las extensiones de este documento (variantes, jerarquía, accesibilidad y estados) son **reglas de diseño propuestas** para unificar también el modo integrado. El archivo `constants/theme.ts` todavía incluye una plantilla Expo con acento turquesa: **no usar ese acento por defecto** en pantallas institucionales; consolidarlo con la paleta Educar cuando corresponda.

## 2. Colores y tokens

| Token recomendado | HEX | Uso |
|---|---|---|
| `brand.primary` | `#3B82F6` | Identidad, íconos, acentos, elementos no textuales |
| `brand.primaryStrong` | `#245FC6` | Botones primarios con texto blanco, links y selección |
| `text.primary` | `#172B4D` | Títulos, valores monetarios y contenido principal |
| `text.secondary` | `#607089` | Descripciones, datos auxiliares y etiquetas secundarias |
| `border.default` | `#E5ECF5` | Bordes y separadores |
| `surface.softBlue` | `#EDF5FF` | Selección, iconos en tiles y avisos informativos |
| `surface.page` | `#F6F8FC` | Fondo de todas las pantallas |
| `surface.card` | `#FFFFFF` | Tarjetas, formularios y menús |
| `status.success` | `#187452` | Pagado, aprobado, servicio vigente |
| `status.warning` | `#986200` | Pendiente, próxima fecha, en revisión |
| `status.danger` | `#BA3A42` | Rechazado, error, vencido o acción destructiva |
| `status.successBg` | `#E7F6EF` | Fondo de estado positivo |
| `status.warningBg` | `#FFF4D9` | Fondo de estado pendiente |
| `status.dangerBg` | `#FFF0F0` | Fondo de estado de error |

**Reglas:**

- Reservar el azul principal para la marca; para texto blanco sobre azul preferir `#245FC6` o comprobar relación de contraste **≥ 4.5:1**. No dar por válido el azul `#3B82F6` con texto blanco pequeño sin medirlo.
- Blanco y azul oscuro para información importante; no usar verde/amarillo como paleta dominante de una pantalla. Los estados semánticos sí pueden utilizar esos colores.
- Usar el mismo color para el mismo significado en Inicio, Cuotas, Historial, Comprobantes y Servicios.
- **No comunicar un estado solamente mediante color:** acompañar siempre con texto y, cuando aporte, ícono.
- Evitar degradados intensos, efectos de vidrio, fondos de color saturados en toda la pantalla y sombras excesivas.

## 3. Tipografía

Mantener la familia **sans-serif de sistema** de React Native/Expo. No agregar una fuente externa salvo necesidad justificada. Usar pesos, tamaños y line-height consistentes.

| Estilo | Tamaño / interlínea | Peso | Uso |
|---|---|---|---|
| Display / cifra destacada | 28–32 / 34–38 | 700–800 | Saldo general o encabezado de inicio |
| Título de pantalla | 26–28 / 32–34 | 700–800 | Inicio, Cuotas, Mis hijos, Servicios |
| Título de sección | 18 / 24 | 700 | «Facturas pendientes», «Transporte» |
| Título de tarjeta | 16 / 22 | 600–700 | Nombre de hijo, factura, recorrido |
| Texto de lectura | 15–16 / 22–24 | 400 | Información principal y formularios |
| Texto auxiliar | 13–14 / 19–21 | 400–500 | Fechas, descripciones, pistas |
| Etiqueta corta | 12–13 / 17–18 | 600–700 | Estado y metadatos |

- Cifras de dinero con peso 700–800 y color `text.primary`; separar claramente **total**, **abonado** y **saldo**.
- No usar textos menores de 12 px como información necesaria. Para formularios preferir 16 px cuando sea posible.
- Permitir `fontScale`/Dynamic Type; evitar alturas fijas para texto multilínea y el truncado de nombres, materias, recorridos o conceptos.

## 4. Espaciado, formas y superficies

**Escala base (dp):** `4, 8, 12, 16, 20, 24, 32`.

- Padding horizontal de pantalla: **16–22 dp**; vertical adaptado a `SafeAreaView`.
- Entre secciones: **24 dp**; entre tarjetas de una lista: **12–16 dp**.
- Tarjeta principal: blanco, borde `#E5ECF5` de 1 dp, radio **18–22 dp**, padding **16–20 dp**, sombra muy suave cuando sea compatible.
- Inputs: alto mínimo **50 dp**, radio **12–14 dp**, borde visible y texto legible.
- Botón primario: alto **48–52 dp**, radio **14–15 dp**; **área táctil ≥ 44×44 dp** para cualquier botón de ícono.
- Chips de estado: radio **9–10 dp**, padding horizontal **10 dp** y vertical **5–6 dp**.
- Íconos consistentes: preferir `Ionicons` ya presente en el proyecto, tamaños **20–24 dp** (28 dp en puntos de énfasis).

## 5. Componentes reutilizables

### Botones

- **Primary:** fondo `brand.primaryStrong`, texto blanco; una acción principal por bloque (p. ej., «Informar transferencia»).
- **Secondary:** fondo `surface.softBlue`, texto `brand.primaryStrong`, borde suave.
- **Outline / Ghost:** secundarias como «Volver», «Ver detalle» y «Cancelar».
- **Destructive:** solo para acciones destructivas; exigir confirmación cuando sea irreversible.
- Todos: estados `pressed`, `disabled`, `loading`, foco cuando aplique y nombre accesible específico. Evitar íconos clicables sin etiqueta.
- No habilitar dos veces «Enviar comprobante» mientras existe una solicitud en curso.

### Tarjetas, listas y filtros

- Reutilizar un `Card` base en todos los módulos, sin reinventar radios y sombras por pantalla.
- Un título por tarjeta, contenido en orden lógico, separación visual entre datos y CTA.
- Tarjetas de facturas: **Alumno + período** → **total** → **pagado** → **saldo** → **estado** → **fecha** → **detalle/acción**.
- Filtros con selección inequívoca: `Todas`, `Pendientes`, `Pagadas`, `Vencidas`. Mantener coherencia entre estado seleccionado y resultados.
- Las listas vacías deben explicar el motivo y, si procede, ofrecer una salida útil; nunca dejar un recuadro blanco sin texto.

### Formularios

- Etiquetas visibles permanentes, no solo `placeholder`; explicación breve para fechas, montos y archivos.
- Señalar obligatorios y explicar errores **junto al campo**; no limpiar lo escrito ante un error.
- El teclado no debe tapar botones: `KeyboardAvoidingView` / scroll o alternativa equivalente según plataforma.
- Respetar `SafeAreaView`, notch y barra inferior.
- Confirmar claramente qué pasó después del envío: «Transferencia informada. Pendiente de revisión», **no** «Pago realizado».

### Estados de red

- **Loading:** indicador + mensaje breve («Cargando facturas…»); no bloquear indefinidamente.
- **Error:** explicación concreta, reintento y conservación del estado del formulario.
- **Empty:** explicación contextual y CTA opcional.
- **Success:** acción completada y nueva información visible; no declarar pagos aprobados hasta confirmación del backend.

## 6. Patrones por pantalla

### Inicio (Familia)

Saludo breve y nombre institucional; selector de hijo claramente visible; resumen **saldo pendiente**, próximo vencimiento y accesos directos a Cuotas, Servicios y Transporte. No competir con múltiples tarjetas llamativas.

### Inicio (Estudiante)

Resumen de curso, horarios, deportes, transporte y comedor. **Nunca mostrar deuda, facturas, pagos ni botones financieros al estudiante.**

### Mis hijos

Selección inequívoca de hijo, mostrando **nombre + curso/nivel**. El cambio de hijo debe actualizar todos los datos relacionados sin presentar información del hijo anterior durante la carga.

### Cuotas y facturas

Diseñar para que cualquier padre comprenda: **cuánto debe, por qué, cuándo vence y qué acción puede realizar**. Mostrar ARS con separadores argentinos, sin montos ambiguos; distinguir `Pendiente`, `En revisión`, `Pagada`, `Vencida`. Facturas con detalle de conceptos y filtro por período.

### Informar transferencia

Flujo corto: **Factura → monto/ítems → comprobante → revisar → enviar**. Informar formatos PDF/JPG/PNG y límite del backend. Permitir múltiples comprobantes conforme al flujo existente; indicar que la aprobación corresponde a Administración. Hacer visibles los estados del archivo seleccionado y del envío.

### Deportes / Transporte / Comedor

Mismos patrones de tarjetas. Deportes: grupo, profesor, horario, cupos y estado. Transporte: recorrido, parada y horario; posición GPS **claramente «Simulación»** si no proviene de datos reales. Comedor: servicio/turno e inscripción/uso cuando exista. Las solicitudes familiares tienen estados visibles y no deben confundirse con inscripciones ya aprobadas.

### Perfil y sesión

Identidad y rol claros; configuración/contraseña y cierre de sesión visibles. No mezclar el cambio de rol visual DEMO con autenticación real.

## 7. Navegación y composición

- Mantener **Expo Router** y la navegación inferior ya existente, consistente entre pestañas.
- Familia y Estudiante ven solamente destinos permitidos por rol; no agregar botones muertos.
- La pantalla activa debe destacarse por **ícono + texto + estado visual**, no por color solo.
- Acciones importantes cerca del contenido que modifican, no escondidas en el footer del scroll.
- Evitar pantallas con más de una jerarquía de header o elementos que se tapen con la barra inferior.

## 8. Accesibilidad mínima verificable

- `accessibilityRole`, `accessibilityLabel`, `accessibilityState` y descripciones en botones e inputs según corresponda.
- Objetivos táctiles **≥44×44 dp**, sin controles apretados uno contra otro.
- Contraste de texto normal **≥4.5:1**, texto grande **≥3:1**; medir variantes de estado y disabled relevantes.
- Navegación lógica con TalkBack/VoiceOver cuando sea posible, lectura de importes y estados comprensible.
- Foco/teclado en Expo Web; selección táctil, teclado virtual, scroll y safe areas en Expo Go/Android.
- No ocultar información mediante `numberOfLines=1` cuando afecta decisiones (nombre de hijo, monto, concepto, recorrido o error).
- Alertas y validaciones deben comunicarse también sin color y no bloquear el regreso.

## 9. Reglas técnicas de adopción por Codex

1. Inspeccionar el estado actual de `educar-mobile`, **especialmente modo integrado y modo DEMO**. No presumir que ambos ya comparten componentes.
2. Consolidar tokens en un único módulo (puede adaptar `constants/theme.ts` o un `theme/tokens.ts` según la arquitectura real) y reutilizar `components/demo-ui.tsx` en vez de duplicar estilos.
3. Migrar gradualmente pantallas divergentes: **no hacer una reescritura completa**.
4. Respetar Expo SDK instalado, React Native StyleSheet y las dependencias existentes. No agregar una librería UI por comodidad.
5. No modificar RPC, RLS, autenticación, estados financieros o reglas de negocio por una tarea visual.
6. Inspeccionar las pantallas con **navegador integrado sobre Expo Web en localhost** y, si existe acceso, validar Expo Go Android por separado. No presentar una prueba web como prueba nativa.
7. Antes de dar por cerrada una pantalla: probar ambas cuentas, longitudes de texto, errores, cargas y estados vacíos; revisar anchos 360/390/768 dp y teclado.
8. Ejecutar `npm run lint`, `npx tsc --noEmit`, `node --test tests/*.test.mjs` y `npx expo-doctor`; reportar resultados efectivos.
9. Crear `REVISION_DESIGN_SYSTEM_MOVIL.md` con capturas, diferencias corregidas y pendientes. No ejecutar commit/push/deploy sin autorización.

## 10. Criterios de aceptación visual

- [ ] Todas las pantallas se reconocen como Educar; sin turquesa de plantilla Expo ni paletas ajenas.
- [ ] Misma tipografía, color, radio y espaciado en ambos roles.
- [ ] No hay textos cortados, botones desplazados ni contenido oculto por teclado/tab bar.
- [ ] Saldo, períodos y estados de pago son fáciles de entender.
- [ ] Los formularios explican qué se envía y cuándo se considera aprobado.
- [ ] Los botones funcionan y sus estados visuales están sincronizados con la acción.
- [ ] El modo integrado y la demo visual comparten identidad, sin confundir datos reales y ficticios.
- [ ] Las pruebas de navegador, lint, TypeScript y Expo Doctor están documentadas, incluyendo límites.

**Principio rector:** diseño institucional consistente, claridad por encima de decoración y ninguna pérdida de funcionalidad.

## Extensión visual: comunidad escolar (05/11/2026)

La portada integrada utiliza una tarjeta de cuenta con marco azul, interior blanco y cifra tabular. Los perfiles presentan iniciales, nombre y apellido sin truncado; cuando el ancho es insuficiente se apilan. La tipografía de portada puede alcanzar 34/39 dp y el título de acceso 42/46 dp, conservando escalado y contenedor fluido. Se usan nombres directos para navegación y acciones; la personalidad reside en la composición. La respuesta al toque usa cambios discretos de opacidad y escala sin movimiento automático. Mantener este criterio en futuras extensiones.
