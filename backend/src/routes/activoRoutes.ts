import { Router } from 'express';
import { listarActivos } from '../controllers/activoController';

const router = Router();

router.get('/', listarActivos);

export default router;