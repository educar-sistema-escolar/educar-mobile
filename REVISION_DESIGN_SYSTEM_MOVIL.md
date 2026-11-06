# Revisión del Design System móvil

Fecha: 03/11/2026. Estado: **implementación y verificación visual parciales**; esta revisión no constituye una aprobación integral de accesibilidad ni de Android.

## Referencia

Se copió sin modificaciones `docs/EDUCAR_MOBILE_DESIGN_SYSTEM.md` desde el documento entregado y se vinculó en el README. `constants/palette.ts` concentra los colores institucionales compartidos por demo e integrado; se ajustaron superficies, tarjetas, botones, navegación, tipografía y acentos de la plantilla Expo. Se conservó la lógica de Supabase y las rutas existentes.

## Cambios y observaciones

- Inicio y cuenta: textos traducidos al español y saludo de estudiante basado en su ficha cuando el nombre del perfil está vacío.
- Cuotas: detalle por concepto en filas verticales, botones azules y filtros con mayor área táctil; traducción de estados y acciones.
- Transferencias: etiquetas, validaciones y constancia en español; importes y selección de comprobante conservan las reglas existentes.
- Servicios: nombres de niveles traducidos sin alterar la base, colores compartidos y corrección del botón Consultar que se recortaba en la pantalla estrecha.
- DEMO: colores y botón principal reutilizan los mismos tokens; no se cambiaron sus datos ficticios.

## Verificación visual y funcional

En el navegador integrado y usando Supabase real se observó el inicio de Familia, ambos hijos y sus saldos, las facturas de un hijo filtradas por 2027 y el formulario de transferencia. Se seleccionó un concepto e introdujo un importe parcial; al omitir comprobante, la interfaz indicó que debía adjuntarse. No se envió ninguna transferencia ni se modificaron datos.

Se ingresó con la cuenta DEMO de Estudiante, se comprobó que la barra no muestra Cuotas y se consultaron curso, deportes, profesores, horario, recorrido, parada y comedor de 2027. Se observaron inicio y Servicios en una ventana estrecha y se corrigió el recorte del botón de ciclo; no se guardaron capturas. El ciclo familiar de solicitudes, la subida real y revisión administrativa no se probaron de extremo a extremo en esta etapa.

Después de reiniciar Metro para abrir DEMO, el servidor dio `Unable to resolve module styleq/transform-localize-style`; el archivo existe en `node_modules` pero aparece como `ReparsePoint` de OneDrive. La relación con OneDrive es una hipótesis, no una causa confirmada. El reinicio del servidor integrado también presentó ese error; se requiere resolverlo antes de completar la revisión visual de todas las pantallas en ambos modos y en anchos 360/390/768. No se modificaron dependencias para ocultar el problema. Las capturas de evidencia quedan pendientes.

## Controles

En esta iteración pasaron lint, TypeScript, 35 pruebas existentes y Expo Doctor 21/21; también pasaron dos pruebas nuevas de localización. Tras el último ajuste de cuenta se repitieron lint y TypeScript. No se probó Expo Go, teclado nativo ni lector de pantalla. La comprobación del contraste es pendiente; las etiquetas, estados y tamaños incorporados no equivalen a una auditoría completa.

Pendientes: restaurar Metro, recorrer DEMO e integrado completo, probar accesibilidad y distintos tamaños, probar transferencia con comprobante en datos DEMO controlados, y validar en Expo Go. No se realizaron commit, push ni despliegue.

## Actualización: Metro y revisión visual posterior

El error `styleq/transform-localize-style` se reprodujo tras reiniciar Metro. Node resolvía el paquete y los archivos tenían atributos `ReparsePoint` de OneDrive. Se sustituyeron **solo los archivos de la copia instalada de `node_modules/styleq` con ese atributo** por copias locales de sus propios bytes, verificando SHA-256, y se reinició Metro con `--clear`. Después compilaron y abrieron tanto el modo integrado en el puerto 8083 como el modo DEMO en el 8084. No se modificó la versión ni el contenido de la dependencia. Es una reparación de instalación local, no una garantía permanente: reinstalar dependencias o la sincronización de OneDrive puede volver a provocar el síntoma.

En Familia integrada se comprobó el ingreso, selección de alumno, facturas de 2027, estados aprobada/pendiente, conceptos, pagos e información de servicios. En DEMO se recorrieron ingreso, Familia, Mis hijos, Cuotas, detalle, transferencia simulada, Servicios, Transporte, cuenta y cierre; se seleccionó Estudiante y se comprobó que no aparece Cuotas. La sesión anterior también comprobó Estudiante integrado y validación sin comprobante. No se enviaron transferencias reales ni se solicitaron inscripciones.

Se observó que el encabezado familiar recortaba el avatar a 360 px y se corrigió permitiendo que el saludo ocupe varias líneas. Se comprobaron ventanas de 360, 390 y 768 px en las pantallas capturadas; no se afirma que cada pantalla se haya probado a cada ancho. En `docs/evidencias-qa/` están las capturas: `demo-transferencia-360.jpg`, `demo-servicios-390.jpg`, `demo-estudiante-390.jpg`, `demo-estudiante-768.jpg`, `integrado-cuotas-768.jpg` e `integrado-servicios-768.jpg`. Son capturas web, no Android. Algunas capturas muestran solo la parte visible de la página.

Controles posteriores al ajuste del encabezado: lint, TypeScript y 37 pruebas Node aprobadas; Expo Doctor 21/21; `git diff --check` sin errores. Quedan pendientes el envío de comprobantes y su aprobación de punta a punta, prueba nativa Expo Go, lector de pantalla y una revisión de todas las pantallas en todos los tamaños. No se efectuaron commit ni push.

## Evolución visual — 05/11/2026

Dirección: portada de comunidad escolar, tarjeta de cuenta enmarcada en azul, perfiles con iniciales, iconografía Ionicons y jerarquía tipográfica de sistema. Se conservaron los colores institucionales y no se agregaron dependencias. La portada integrada de Familia y Estudiante, el acceso, el selector de alumnos, las tarjetas de cuotas y la navegación recibieron cambios. Los componentes compartidos DEMO reciben ajustes de espaciado, lectura y selección de pestaña; no se considera rediseñada cada pantalla DEMO.

La cuenta muestra saldo y primer vencimiento pendiente con los datos existentes. Los movimientos distinguen estado con texto e icono. Los nombres de acciones se simplificaron: «Ver cuotas y pagos», «Servicios escolares» y «Mis hijos · Seleccioná un perfil». Los filtros se distribuyen en dos columnas para evitar un cuarto botón aislado. Las interacciones de portada responden al toque sin animaciones continuas.

Se inspeccionaron Inicio y Cuotas integrados en navegador a 360, 390 y 768 px, ingreso familiar, cambio de hijo y filtro 2027. Se corrigió el nombre que se partía a 360 px apilando perfiles en pantallas estrechas. No se probó esta revisión en Android ni con lector de pantalla; la revisión exhaustiva del resto de pantallas y modo DEMO sigue pendiente. TypeScript y las 37 pruebas automatizadas pasaron. Expo Doctor: 20/21; informa cuatro actualizaciones patch de Expo disponibles, sin cambio de SDK aplicado. Los cambios de esta etapa son locales.
