import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './database/db';
import activoRoutes from './routes/activoRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Backend de SIGEA funcionando' });
});

app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conectado: true, hora_servidor: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ conectado: false, error: String(error) });
  }
});

app.use('/api/activos', activoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});