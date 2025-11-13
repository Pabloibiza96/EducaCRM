import { Router } from 'express';

const router = Router();

let alumnos = [
  { id: 1, nombre: 'María', apellidos: 'Gómez López', email: 'maria@escuela.com', grupo: '1ºA' },
  { id: 2, nombre: 'Luis', apellidos: 'Martín Pérez', email: 'luis@escuela.com', grupo: '1ºB' },
  { id: 3, nombre: 'Carla', apellidos: 'Ruiz Sánchez', email: 'carla@escuela.com', grupo: '2ºA' },
];

// Obtener todos
router.get('/', (_req, res) => {
  res.json(alumnos);
});

// Crear nuevo
router.post('/', (req, res) => {
  const nuevo = { id: alumnos.length + 1, ...req.body };
  alumnos.push(nuevo);
  res.status(201).json(nuevo);
});

// Editar
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = alumnos.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).send('Alumno no encontrado');
  alumnos[index] = { ...alumnos[index], ...req.body };
  res.json(alumnos[index]);
});

// Eliminar
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  alumnos = alumnos.filter(a => a.id !== id);
  res.status(204).send();
});

export default router;