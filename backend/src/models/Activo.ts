export interface Activo {
  id_activo: number;
  codigo_qr: string;
  tipo: string;
  marca: string | null;
  modelo: string | null;
  serial: string | null;
  estado_actual: string;
  fecha_registro: Date;
  fecha_baja: Date | null;
  id_ambiente_actual: number | null;
}