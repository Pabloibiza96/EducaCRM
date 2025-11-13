import type { Request, Response } from 'express';

let alumnos = [
  { id: 1, nombre: 'Ana López', apellidos: 'Martínez', email: 'ana@edu.com', grupo: '1º DAW' },
  { id: 2, nombre: 'Carlos Ruiz', apellidos: 'García', email: 'carlos@edu.com', grupo: '2º DAM' },
];

export const getAlumnos = (_req: Request, res: Response) => {
  res.json(alumnos);
};

export const addAlumno = (req: Request, res: Response) => {
  const { nombre, apellidos, email, grupo } = req.body;
  
  // Validaciones
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre es requerido' });
  }
  if (!apellidos || apellidos.trim() === '') {
    return res.status(400).json({ message: 'Los apellidos son requeridos' });
  }
  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'El email es requerido' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'El email no es válido' });
  }
  
  const nuevo = { id: alumnos.length + 1, nombre, apellidos, email, grupo: grupo || '' };
  alumnos.push(nuevo);
  res.status(201).json(nuevo);
};

export const updateAlumno = (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, apellidos, email, grupo } = req.body;
  
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  
  // Validaciones
  if (nombre !== undefined && nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre no puede estar vacío' });
  }
  if (apellidos !== undefined && apellidos.trim() === '') {
    return res.status(400).json({ message: 'Los apellidos no pueden estar vacíos' });
  }
  if (email !== undefined) {
    if (email.trim() === '') {
      return res.status(400).json({ message: 'El email no puede estar vacío' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'El email no es válido' });
    }
  }
  
  const index = alumnos.findIndex(a => a.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Alumno no encontrado' });
  alumnos[index] = { ...alumnos[index], ...req.body };
  res.json(alumnos[index]);
};

export const deleteAlumno = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  alumnos = alumnos.filter(a => a.id !== parseInt(id));
  res.json({ message: 'Alumno eliminado' });
};
