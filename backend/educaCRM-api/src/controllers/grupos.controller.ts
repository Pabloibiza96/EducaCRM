import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Grupo } from "../entities/Grupo.js";

const repo = () => AppDataSource.getRepository(Grupo);

export const getGrupos = async (_req: Request, res: Response) => {
  try {
    const grupos = await repo().find();
    res.json(grupos);
  } catch (err) {
    console.error("Error listando grupos", err);
    res.status(500).json({ message: "Error obteniendo grupos" });
  }
};

export const createGrupo = async (req: Request, res: Response) => {
  try {
    const { nombre, curso } = req.body;

    if (!nombre || !curso) {
      return res
        .status(400)
        .json({ message: "Nombre y curso son obligatorios" });
    }

    const grupo = repo().create({ nombre, curso });
    const saved = await repo().save(grupo);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creando grupo", err);
    res.status(500).json({ message: "Error creando grupo" });
  }
};

export const updateGrupo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repoG = repo();

    const grupo = await repoG.findOneBy({ id });
    if (!grupo) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    const { nombre, curso } = req.body;
    grupo.nombre = nombre ?? grupo.nombre;
    grupo.curso = curso ?? grupo.curso;

    const updated = await repoG.save(grupo);
    res.json(updated);
  } catch (err) {
    console.error("Error actualizando grupo", err);
    res.status(500).json({ message: "Error actualizando grupo" });
  }
};

export const deleteGrupo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await repo().delete(id);

    if (!result.affected) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Error eliminando grupo", err);
    res.status(500).json({ message: "Error eliminando grupo" });
  }
};
