import { RolUsuario } from "../entities/Usuario.js";

export interface UsuarioDTO {
  id: number;
  username: string;
  rol: RolUsuario;
  personaId: number;
  nombre: string;
  apellidos: string;
  email: string | null;
}

export interface UsuarioPayload {
  username: string;
  password?: string;
  rol: RolUsuario;
  nombre: string;
  apellidos: string;
  email?: string;
}