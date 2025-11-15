import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Departamento } from "../entities/Departamento.js";

export const getDepartamentos = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Departamento);
    const data = await repo.find();

    res.json(data);
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    res.status(500).json({ error: "Error al obtener departamentos" });
  }
};