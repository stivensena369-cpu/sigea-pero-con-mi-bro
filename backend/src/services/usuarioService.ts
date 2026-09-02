import { pool } from '../database/db';
import { Usuario } from '../models/Usuario';

export async function obtenerTodosLosUsuarios(): Promise<Usuario[]> {
  const resultado = await pool.query(`
    SELECT
      id_usuario,
      documento,
      nombres,
      apellidos,
      email,
      rol,
      fecha_registro,
      activo
    FROM usuario
    ORDER BY id_usuario
  `);
  return resultado.rows;
}