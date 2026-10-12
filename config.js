// Edita únicamente los valores pendientes. Conserva las comillas.
window.BODA_CONFIG = {
  fecha: '2026-12-26',
  // Se desconoce la hora de la ceremonia: la cuenta muestra días de calendario,
  // NO indica cuánto falta para el inicio de la ceremonia.
  horaCeremonia: '',
  horaRecepcion: '',
  direccionRecepcion: '',
  whatsapp: '', // Número colombiano con indicativo, p. ej. 57XXXXXXXXXX (sin +)
  musica: 'assets/Amor y Sentimiento - Banda Nueva Esperanza de Manguelito La que toca Bonito (Audio Corregido).mp3', // MP3 incorporado por los novios; verificar permiso de publicación
  inicioMusica: 92, // 1 minuto y 32 segundos; iniciar al pulsar ABRIR INVITACIÓN
  fotoPrincipal: 'imagen.png', // assets/foto-principal.jpg
  fotosHistoria: ['', ''],
  // Opcional: enlaces ?invitado=CODIGO. Este control es orientativo del lado del navegador,
  // no sirve como registro seguro ni como verificación de identidad.
  invitados: {
    // 'familia-ejemplo': {nombre:'Familia Ejemplo', cupos: 2}
  }
};
