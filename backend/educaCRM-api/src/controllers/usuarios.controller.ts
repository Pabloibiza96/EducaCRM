import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entities/Usuario.js";
import { Persona } from "../entities/Persona.js";
import { UsuarioDTO, UsuarioPayload } from "../models/UsuarioDTO.js";
import bcrypt from "bcryptjs";

const usuarioRepo = AppDataSource.getRepository(Usuario);
const personaRepo = AppDataSource.getRepository(Persona);

const DEFAULT_PASSWORD = "admin";
const SALT_ROUNDS = 10;

function toDTO(u: Usuario): UsuarioDTO {
  return {
    id: u.id,
    username: u.username,
    rol: u.rol,
    personaId: u.persona.id,
    nombre: u.persona.nombre,
    apellidos: u.persona.apellidos,
    email: u.persona.email ?? null,
  };
}

/* GET /api/usuarios*/
export async function getUsuarios(_req: Request, res: Response) {
  try {
    const usuarios = await usuarioRepo.find();
    return res.json(usuarios.map(toDTO));
  } catch (err) {
    console.error("Error listando usuarios", err);
    return res.status(500).json({ message: "Error listando usuarios" });
  }
}

/* POST /api/usuarios*/
export async function createUsuario(req: Request, res: Response) {
  try {
    const body: UsuarioPayload = req.body;

    if (!body.username || !body.rol || !body.nombre || !body.apellidos) {
      return res.status(400).json({
        message: "username, rol, nombre y apellidos son obligatorios",
      });
    }

    // Username único
    const existing = await usuarioRepo.findOne({
      where: { username: body.username },
    });
    if (existing) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Email único
    if (body.email) {
      const emailExists = await personaRepo.findOne({
        where: { email: body.email },
      });
      if (emailExists) {
        return res.status(409).json({
          message: "El email ya está asignado a otra persona",
        });
      }
    }

    // Crear persona
    const persona = new Persona();
    persona.dni = `USR-${Date.now()}`.slice(0, 15);
    persona.nombre = body.nombre;
    persona.apellidos = body.apellidos;
    persona.telefono = null;
    persona.email = body.email ?? null;
    persona.direccion = null;

    const savedPersona = await personaRepo.save(persona);

    // Determinar contraseña en claro
    const plainPassword =
      body.password && body.password.trim() !== ""
        ? body.password.trim()
        : DEFAULT_PASSWORD;

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    // Crear usuario
    const user = new Usuario();
    user.username = body.username;
    user.rol = body.rol;
    user.passwordHash = passwordHash;
    user.persona = savedPersona;

    const savedUser = await usuarioRepo.save(user);

    return res.status(201).json(toDTO(savedUser));
  } catch (err: any) {
    console.error("Error creando usuario", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email o usuario duplicado" });
    }

    return res.status(500).json({ message: "Error creando usuario" });
  }
}

/*PUT /api/usuarios/:id */
export async function updateUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const body: Partial<UsuarioPayload> = req.body;

    const user = await usuarioRepo.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambiar username y validar duplicados
    if (body.username && body.username !== user.username) {
      const existing = await usuarioRepo.findOne({
        where: { username: body.username },
      });
      if (existing) {
        return res.status(409).json({ message: "El usuario ya existe" });
      }
      user.username = body.username;
    }

    // Cambiar rol
    if (body.rol) {
      user.rol = body.rol;
    }

    // Cambiar contraseña si viene
    if (body.password && body.password.trim() !== "") {
      const newHash = await bcrypt.hash(body.password.trim(), SALT_ROUNDS);
      user.passwordHash = newHash;
    }

    // Actualizar persona asociada
    const persona = user.persona;

    if (body.nombre) persona.nombre = body.nombre;
    if (body.apellidos) persona.apellidos = body.apellidos;

    // Email único
    if (body.email !== undefined) {
      if (body.email) {
        const emailExists = await personaRepo.findOne({
          where: { email: body.email },
        });
        if (emailExists && emailExists.id !== persona.id) {
          return res
            .status(409)
            .json({ message: "El email ya está asignado a otra persona" });
        }
      }
      persona.email = body.email ?? null;
    }

    await personaRepo.save(persona);
    const saved = await usuarioRepo.save(user);

    return res.json(toDTO(saved));
  } catch (err) {
    console.error("Error actualizando usuario", err);
    return res.status(500).json({ message: "Error actualizando usuario" });
  }
}

/* DELETE /api/usuarios/:id */
export async function deleteUsuario(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const user = await usuarioRepo.findOne({
      where: { id },
      relations: ["persona"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar persona
    await personaRepo.delete(user.persona.id);

    return res.status(204).send();
  } catch (err) {
    console.error("Error eliminando usuario", err);
    return res.status(500).json({ message: "Error eliminando usuario" });
  }
}
