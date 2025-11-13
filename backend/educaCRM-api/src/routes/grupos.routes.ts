import { Router } from 'express';
import { getGrupos, addGrupo, updateGrupo, deleteGrupo } from '../controllers/grupos.controller.js';

const router = Router();

router.get('/', getGrupos);
router.post('/', addGrupo);
router.put('/:id', updateGrupo);
router.delete('/:id', deleteGrupo);

export default router;
