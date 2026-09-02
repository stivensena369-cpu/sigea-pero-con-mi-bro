import { Request, Response } from 'express';
import { obtenerTodosLosUsuarios } from '../services/usuarioService';

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios', detalle: String(error) });
  }
}