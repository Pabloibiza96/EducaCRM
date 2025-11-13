import { Router } from 'express';
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

router.get('/', getUsuarios);
router.post('/', addUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
