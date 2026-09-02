export interface Usuario {
  id_usuario: number;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
  fecha_registro: Date;
  activo: boolean;
}