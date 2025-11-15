import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Persona } from "../entities/Persona.js";

export const getPersonas = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Persona);
    const data = await repo.find({
      order: { apellidos: "ASC", nombre: "ASC" }
    });

    res.json(data);
  } catch (error) {
    console.error("Error al obtener personas:", error);
    res.status(500).json({ error: "Error al obtener personas" });
  }
};

export const getPersonaById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Persona);
    const persona = await repo.findOneBy({ id: Number(req.params.id) });

    if (!persona) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json(persona);
  } catch (error) {
    console.error("Error al obtener persona:", error);
    res.status(500).json({ error: "Error al obtener persona" });
  }
};