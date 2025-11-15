import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entities/Usuario.js";

const usuariosRepo = AppDataSource.getRepository(Usuario);

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son obligatorios" });
    }

    const usuario = await usuariosRepo.findOne({
      where: { username },
    });

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // PARCHE PROVISIONAL:
    // Mientras en la BD tenga hashes de ejemplo no válidos,
    // aceptamos la contraseña "admin" para cualquier usuario existente.
    if (password !== "admin") {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Respuesta de login (sin JWT de momento)
    return res.json({
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      personaId: usuario.personaId,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor durante el login" });
  }
};