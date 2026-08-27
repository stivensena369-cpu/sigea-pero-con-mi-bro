export type UserRole = 'Aprendiz' | 'Instructor' | 'Administrador';

export interface User {
  documento: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  fichaId?: string; // For students
  telefono?: string;
  avatarUrl?: string;
}

export type TipoActivo = 'Monitor' | 'Teclado' | 'Ratón' | 'Torre' | 'Todo-en-Uno';

export type EstadoActivo = 'Disponible' | 'En Uso' | 'En Mantenimiento' | 'De Baja';

export interface Activo {
  codigo_qr: string; // e.g. "QR-MON-001"
  tipo: TipoActivo;
  marca: string;
  modelo: string;
  serial: string;
  sedeId: string;
  ambienteId: string;
  puestoNumero?: number;
  estado: EstadoActivo;
  observaciones?: string;
  fechaRegistro?: string;
}

export interface Sede {
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
}

export interface Ambiente {
  id: string;
  nombre: string; // e.g. "Ambiente 101"
  sedeId: string;
  tipoEquipamiento: 'Torre_y_Perifericos' | 'All_in_One';
  capacidadPuestos: number;
  descripcion: string;
  piso: string;
}

export interface Ficha {
  id: string; // e.g. "123456"
  nombrePrograma: string; // e.g. "Análisis y Desarrollo de Software (ADSO)"
  jornada: 'Diurna' | 'Nocturna' | 'Mixta';
  sedeId: string;
  instructorLiderDoc: string;
  totalAprendices: number;
}

export type EstadoClase = 'Programada' | 'En Curso' | 'Finalizada' | 'Cancelada';

export interface ClaseFormacion {
  id: number;
  fecha: string; // "2026-08-20"
  hora_inicio: string; // "10:00"
  hora_fin: string; // "12:00"
  fichaId: string;
  sedeId: string;
  ambienteId: string;
  instructorDoc: string;
  tema: string;
  estado: EstadoClase;
  observacionesCierre?: string;
  checklistCierre?: ChecklistFinalizacion;
}

export interface ChecklistFinalizacion {
  equiposApagados: boolean;
  perifericosCompletos: boolean;
  puestosOrdenados: boolean;
  novedadesReportadas: boolean;
  llavesEntregadas: boolean;
  firmaInstructor?: string;
}

export interface RegistroActivo {
  id: string;
  id_usuario: string; // Aprendiz doc
  id_clase: number;
  id_activo: string; // codigo_qr
  tipo_activo: TipoActivo;
  fecha_hora_registro: string;
  estado_entrega: 'Excelente' | 'Bueno' | 'Con Novedad';
  estado_devolucion?: 'Excelente' | 'Bueno' | 'Con Novedad';
  observaciones_entrega?: string;
  observaciones_devolucion?: string;
  liberadoPorCambio?: boolean;
}

export interface SolicitudCambioPuesto {
  id: string;
  aprendizDoc: string;
  claseId: number;
  motivo: string;
  estado: 'Pendiente' | 'Autorizado' | 'Rechazado';
  fechaSolicitud: string;
  fechaRespuesta?: string;
  instructorDoc?: string;
}

export interface NovedadActivo {
  id: string;
  codigo_qr: string;
  reportadoPorDoc: string;
  rolReportante: UserRole;
  claseId?: number;
  fecha: string;
  tipoNovedad: 'Fallo Físico' | 'Fallo Eléctrico' | 'Falta Accesorio' | 'Desgaste' | 'Otro';
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  estado: 'Abierta' | 'En Revisión' | 'Resuelta';
}

export interface HistorialAuditoria {
  id: string;
  fecha: string;
  accion: string;
  usuarioDoc: string;
  usuarioNombre: string;
  rol: UserRole;
  detalle: string;
  codigo_qr?: string;
  claseId?: number;
}
