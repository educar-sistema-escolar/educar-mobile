export function mensajeError(error: unknown, alternativa = 'No se pudo completar la operación. Intentá nuevamente.'): string {
  const mensaje = error instanceof Error ? error.message : '';
  const reglas: [RegExp, string][] = [
    [/invalid login credentials/i, 'El correo o la contraseña son incorrectos.'],
    [/email not confirmed/i, 'Confirmá tu correo electrónico antes de ingresar.'],
    [/too many requests|rate limit/i, 'Se realizaron demasiados intentos. Esperá unos minutos e intentá nuevamente.'],
    [/network|fetch|abort|timeout/i, 'No se pudo conectar. Revisá tu conexión e intentá nuevamente.'],
    [/duplicate|already.*(request|enroll)|different operation/i, 'Ya existe una solicitud o presentación similar. Consultá su estado antes de volver a enviarla.'],
    [/capacity|full/i, 'No quedan cupos disponibles para este servicio.'],
    [/overlap|schedule conflict/i, 'El horario se superpone con otra actividad.'],
    [/two sports|2 sports|maximum.*sport/i, 'El alumno puede tener como máximo dos deportes.'],
    [/access denied|not authorized|permission denied/i, 'No tenés permiso para realizar esta operación.'],
    [/outstanding|exceeds.*amount/i, 'El importe supera el saldo disponible.'],
  ];
  return reglas.find(([patron]) => patron.test(mensaje))?.[1] ?? alternativa;
}
