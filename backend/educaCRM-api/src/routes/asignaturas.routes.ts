import { Router } from 'express';
import { getAsignaturas, addAsignatura, updateAsignatura, deleteAsignatura } from '../controllers/asignaturas.controller.js';

const router = Router();

router.get('/', getAsignaturas);
router.post('/', addAsignatura);
router.put('/:id', updateAsignatura);
router.delete('/:id', deleteAsignatura);

export default router;
