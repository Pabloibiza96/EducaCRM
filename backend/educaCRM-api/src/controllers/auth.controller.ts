import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entities/Usuario.js";
import bcrypt from "bcryptjs";

const usuarioRepo = AppDataSource.getRepository(Usuario);

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 */
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son obligatorios" });
    }

    // Buscar usuario por username
    const user = await usuarioRepo.findOne({
      where: { username },
      relations: ["persona"],
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Comparar la contraseña enviada con el hash almacenado
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Respuesta para el front
    return res.json({
      id: user.id,
      username: user.username,
      rol: user.rol,
      personaId: user.persona.id,
      nombre: user.persona.nombre,
      apellidos: user.persona.apellidos,
      email: user.persona.email ?? null,
    });
  } catch (err) {
    console.error("Error en login", err);
    return res.status(500).json({ message: "Error en el login" });
  }
}
