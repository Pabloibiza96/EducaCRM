import type { Request, Response } from 'express';

let profesores = [
  { id: 1, nombre: 'Juan Pérez', apellidos: 'Sánchez', email: 'juan@edu.com', departamento: 'Informática' },
  { id: 2, nombre: 'María González', apellidos: 'Rodríguez', email: 'maria@edu.com', departamento: 'Matemáticas' },
];

export const getProfesores = (_req: Request, res: Response) => {
  res.json(profesores);
};

export const addProfesor = (req: Request, res: Response) => {
  const nuevo = { id: profesores.length + 1, ...req.body };
  profesores.push(nuevo);
  res.status(201).json(nuevo);
};

export const updateProfesor = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  const index = profesores.findIndex(p => p.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Profesor no encontrado' });
  profesores[index] = { ...profesores[index], ...req.body };
  res.json(profesores[index]);
};

export const deleteProfesor = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  profesores = profesores.filter(p => p.id !== parseInt(id));
  res.json({ message: 'Profesor eliminado' });
};
