import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Asignatura } from "../entities/Asignatura.js";

const asignaturasRepo = AppDataSource.getRepository(Asignatura);

export const getAsignaturas = async (_req: Request, res: Response) => {
  try {
    const asignaturas = await asignaturasRepo.find();
    res.json(asignaturas);
  } catch (error) {
    console.error("Error obteniendo asignaturas", error);
    res.status(500).json({ message: "Error obteniendo asignaturas" });
  }
};

export const getAsignaturaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const asignatura = await asignaturasRepo.findOne({ where: { id } });

    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    res.json(asignatura);
  } catch (error) {
    console.error("Error obteniendo asignatura", error);
    res.status(500).json({ message: "Error obteniendo asignatura" });
  }
};