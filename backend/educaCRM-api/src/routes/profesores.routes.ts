import { Router } from 'express';
import { getProfesores, addProfesor, updateProfesor, deleteProfesor } from '../controllers/profesores.controller.js';

const router = Router();

router.get('/', getProfesores);
router.post('/', addProfesor);
router.put('/:id', updateProfesor);
router.delete('/:id', deleteProfesor);

export default router;
