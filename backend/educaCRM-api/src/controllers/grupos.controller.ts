import type { Request, Response } from 'express';

interface Grupo {
  id: number;
  nombre: string;
  curso: string;
  tutor: string;
  numAlumnos?: number;
}

let grupos: Grupo[] = [
  { id: 1, nombre: '1º ESO A', curso: '2024-2025', tutor: 'Carlos Martínez', numAlumnos: 25 },
  { id: 2, nombre: '1º ESO B', curso: '2024-2025', tutor: 'Laura Sánchez', numAlumnos: 23 },
  { id: 3, nombre: '2º ESO A', curso: '2024-2025', tutor: 'Pedro Gómez', numAlumnos: 27 },
  { id: 4, nombre: '2º ESO B', curso: '2024-2025', tutor: 'Ana López', numAlumnos: 24 },
];

export const getGrupos = (_req: Request, res: Response) => {
  res.json(grupos);
};

export const addGrupo = (req: Request, res: Response) => {
  const nuevo = { id: grupos.length + 1, ...req.body };
  grupos.push(nuevo);
  res.status(201).json(nuevo);
};

export const updateGrupo = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  const index = grupos.findIndex(g => g.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Grupo no encontrado' });
  grupos[index] = { ...grupos[index], ...req.body };
  res.json(grupos[index]);
};

export const deleteGrupo = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  grupos = grupos.filter(g => g.id !== parseInt(id));
  res.json({ message: 'Grupo eliminado' });
};
