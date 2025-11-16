import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Asignatura } from "../entities/Asignatura.js";

const repo = () => AppDataSource.getRepository(Asignatura);

// GET /api/asignaturas
export const getAsignaturas = async (_req: Request, res: Response) => {
  try {
    const asignaturas = await repo().find({
      order: { id: "ASC" },
    });
    res.json(asignaturas);
  } catch (err) {
    console.error("Error getAsignaturas", err);
    res.status(500).json({ message: "Error obteniendo asignaturas" });
  }
};

// GET /api/asignaturas/:id
export const getAsignatura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const asig = await repo().findOne({ where: { id } });
    if (!asig) return res.status(404).json({ message: "Asignatura no encontrada" });
    res.json(asig);
  } catch (err) {
    console.error("Error getAsignatura", err);
    res.status(500).json({ message: "Error obteniendo asignatura" });
  }
};

// POST /api/asignaturas
export const createAsignatura = async (req: Request, res: Response) => {
  try {
    const { nombre, codigo, curso } = req.body as {
      nombre?: string;
      codigo?: string;
      curso?: string | null;
    };

    if (!nombre || !codigo) {
      return res.status(400).json({ message: "Nombre y código son obligatorios" });
    }

    const nueva = repo().create({
      nombre,
      codigo,
      curso: curso ?? null,
    });

    const guardada = await repo().save(nueva);
    res.status(201).json(guardada);
  } catch (err) {
    console.error("Error createAsignatura", err);
    res.status(500).json({ message: "Error creando asignatura" });
  }
};

// PUT /api/asignaturas/:id
export const updateAsignatura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const existente = await repo().findOne({ where: { id } });
    if (!existente) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    const { nombre, codigo, curso } = req.body as {
      nombre?: string;
      codigo?: string;
      curso?: string | null;
    };

    if (nombre !== undefined) existente.nombre = nombre;
    if (codigo !== undefined) existente.codigo = codigo;
    if (curso !== undefined) existente.curso = curso ?? null;

    const guardada = await repo().save(existente);
    res.json(guardada);
  } catch (err) {
    console.error("Error updateAsignatura", err);
    res.status(500).json({ message: "Error actualizando asignatura" });
  }
};

// DELETE /api/asignaturas/:id
export const deleteAsignatura = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const existente = await repo().findOne({ where: { id } });
    if (!existente) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    await repo().remove(existente);
    res.json({ message: "Asignatura eliminada" });
  } catch (err) {
    console.error("Error deleteAsignatura", err);
    res.status(500).json({ message: "Error eliminando asignatura" });
  }
};