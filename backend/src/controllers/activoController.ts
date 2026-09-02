import { Request, Response } from 'express';
import { obtenerTodosLosActivos } from '../services/activoService';

export async function listarActivos(req: Request, res: Response) {
  try {
    const activos = await obtenerTodosLosActivos();
    res.json(activos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los activos', detalle: String(error) });
  }
}