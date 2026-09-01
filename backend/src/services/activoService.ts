import { pool } from '../database/db';
import { Activo } from '../models/Activo';

export async function obtenerTodosLosActivos(): Promise<Activo[]> {
  const resultado = await pool.query(`
    SELECT
      id_activo,
      codigo_qr,
      tipo,
      marca,
      modelo,
      serial,
      estado_actual,
      fecha_registro,
      fecha_baja,
      id_ambiente_actual
    FROM activo
    ORDER BY id_activo
  `);
  return resultado.rows;
}