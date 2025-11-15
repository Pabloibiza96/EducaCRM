import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Usuario } from "../entities/Usuario.js";

export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    const data = await repo.find({
      order: { id: "ASC" },
    });
    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Usuario);
    const usuario = await repo.findOneBy({ id: Number(req.params.id) });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};