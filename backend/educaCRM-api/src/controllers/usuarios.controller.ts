import type { Request, Response } from 'express';
import { validateRequired, validateEmail, validateLength, runValidations } from '../utils/validators.js';

type Role = 'administrador' | 'direccion' | 'jefatura' | 'profesor' | 'alumno';

interface Usuario {
  id: number;
  username: string;
  rol: Role;
  nombre?: string;
  email?: string;
  activo?: boolean;
}

let usuarios: Usuario[] = [
  { id: 1, username: 'admin', rol: 'administrador', nombre: 'Administrador', email: 'admin@educacrm.es', activo: true },
  { id: 2, username: 'director1', rol: 'direccion', nombre: 'Director Principal', email: 'director@educacrm.es', activo: true },
  { id: 3, username: 'jefe.estudios', rol: 'jefatura', nombre: 'Jefe de Estudios', email: 'jefe@educacrm.es', activo: true },
  { id: 4, username: 'carlos.martinez', rol: 'profesor', nombre: 'Carlos Martínez', email: 'carlos.martinez@educacrm.es', activo: true },
  { id: 5, username: 'ana.garcia', rol: 'alumno', nombre: 'Ana García', email: 'ana.garcia@educacrm.es', activo: true },
  { id: 6, username: 'laura.sanchez', rol: 'profesor', nombre: 'Laura Sánchez', email: 'laura.sanchez@educacrm.es', activo: true },
];

const validRoles: Role[] = ['administrador', 'direccion', 'jefatura', 'profesor', 'alumno'];

export const getUsuarios = (_req: Request, res: Response) => {
  res.json(usuarios);
};

export const addUsuario = (req: Request, res: Response) => {
  const { username, rol, nombre, email } = req.body;
  
  // Validaciones
  const error = runValidations(
    validateRequired(username, 'username'),
    validateLength(username, 3, 50, 'username'),
    validateRequired(rol, 'rol')
  );
  
  if (error) {
    return res.status(400).json({ message: error });
  }
  
  if (!validRoles.includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }
  
  if (usuarios.some(u => u.username === username)) {
    return res.status(400).json({ message: 'El username ya existe' });
  }
  
  if (email) {
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError });
    }
  }
  
  const nuevo = { id: usuarios.length + 1, username, rol, nombre, email, activo: true };
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
};

export const updateUsuario = (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, rol, email } = req.body;
  
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  
  const index = usuarios.findIndex(u => u.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: 'Usuario no encontrado' });
  
  // Validaciones opcionales en update
  if (username !== undefined) {
    const error = validateLength(username, 3, 50, 'username');
    if (error) return res.status(400).json({ message: error });
    
    if (usuarios.some(u => u.username === username && u.id !== parseInt(id))) {
      return res.status(400).json({ message: 'El username ya existe' });
    }
  }
  
  if (rol !== undefined && !validRoles.includes(rol)) {
    return res.status(400).json({ message: 'Rol no válido' });
  }
  
  if (email !== undefined && email !== '') {
    const emailError = validateEmail(email);
    if (emailError) return res.status(400).json({ message: emailError });
  }
  
  usuarios[index] = { ...usuarios[index], ...req.body };
  res.json(usuarios[index]);
};

export const deleteUsuario = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'ID requerido' });
  usuarios = usuarios.filter(u => u.id !== parseInt(id));
  res.json({ message: 'Usuario eliminado' });
};
