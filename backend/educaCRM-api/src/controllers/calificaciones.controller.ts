import type { Request, Response } from 'express';
import { validateRequired, validateRange, runValidations } from '../utils/validators.js';

type Evaluacion = '1ª' | '2ª' | '3ª' | 'Extraordinaria';

interface Calificacion {
  id: number;
  alumnoId: number;
  asignaturaId: number;
  evaluacion: Evaluacion;
  nota: number;
  observaciones?: string;
}

let calificaciones: Calificacion[] = [
  { id: 1, alumnoId: 1, asignaturaId: 1, evaluacion: '1ª', nota: 7.5, observaciones: '' },
  { id: 2, alumnoId: 2, asignaturaId: 2, evaluacion: '1ª', nota: 6.0, observaciones: '' },
  { id: 3, alumnoId: 3, asignaturaId: 3, evaluacion: '2ª', nota: 8.0, observaciones: 'Mejora' },
];

const validEvaluaciones: Evaluacion[] = ['1ª', '2ª', '3ª', 'Extraordinaria'];

export const getCalificaciones = (_req: Request, res: Response) => {
  res.json(calificaciones);
};

export const addCalificacion = (req: Request, res: Response) => {
  const { alumnoId, asignaturaId, evaluacion, nota } = req.body;
  
  // Validaciones
  const error = runValidations(
    validateRequired(alumnoId, 'alumnoId'),
    validateRequired(asignaturaId, 'asignaturaId'),
    validateRequired(evaluacion, 'evaluacion'),
    validateRequired(nota, 'nota'),
    validateRange(parseFloat(nota), 0, 10, 'nota')
  );
  
  if (error) {
    return res.status(400).json({ message: error });
  }
  
  if (!validEvaluaciones.includes(evaluacion)) {
    return res.status(400).json({ message: 'Evaluación no válida' });
  }
  
  const nueva = { id: calificaciones.length + 1, ...req.body, nota: parseFloat(nota) };
  calificaciones.push(nueva);
  res.status(201).json(nueva);
};

export const updateCalificacion = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  const index = calificaciones.findIndex(c => c.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Calificación no encontrada' });
  calificaciones[index] = { ...calificaciones[index], ...req.body };
  res.json(calificaciones[index]);
};

export const deleteCalificacion = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  calificaciones = calificaciones.filter(c => c.id !== parseInt(id));
  res.json({ message: 'Calificación eliminada' });
};
