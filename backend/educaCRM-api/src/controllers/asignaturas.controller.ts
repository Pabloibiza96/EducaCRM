import type { Request, Response } from 'express';

let asignaturas = [
  { id: 1, nombre: 'Programación', codigo: 'PROG101', horas: 160, curso: '1º DAW' },
  { id: 2, nombre: 'Bases de Datos', codigo: 'BD102', horas: 120, curso: '1º DAW' },
  { id: 3, nombre: 'Desarrollo Web', codigo: 'WEB201', horas: 180, curso: '2º DAW' },
];

export const getAsignaturas = (_req: Request, res: Response) => {
  res.json(asignaturas);
};

export const addAsignatura = (req: Request, res: Response) => {
  const nueva = { id: asignaturas.length + 1, ...req.body };
  asignaturas.push(nueva);
  res.status(201).json(nueva);
};

export const updateAsignatura = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  const index = asignaturas.findIndex(a => a.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Asignatura no encontrada' });
  asignaturas[index] = { ...asignaturas[index], ...req.body };
  res.json(asignaturas[index]);
};

export const deleteAsignatura = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  asignaturas = asignaturas.filter(a => a.id !== parseInt(id));
  res.json({ message: 'Asignatura eliminada' });
};
