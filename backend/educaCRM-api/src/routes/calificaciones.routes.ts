import { Router } from 'express';
import { getCalificaciones, addCalificacion, updateCalificacion, deleteCalificacion } from '../controllers/calificaciones.controller.js';

const router = Router();

router.get('/', getCalificaciones);
router.post('/', addCalificacion);
router.put('/:id', updateCalificacion);
router.delete('/:id', deleteCalificacion);

export default router;
