import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Departamento } from "../entities/Departamento.js";

const deptRepo = AppDataSource.getRepository(Departamento);

// GET /api/departamentos
export const getDepartamentos = async (_req: Request, res: Response) => {
  try {
    const depts = await deptRepo.find({
      order: { nombre: "ASC" },
    });
    res.json(depts);
  } catch (err) {
    console.error("Error getDepartamentos", err);
    res.status(500).json({ message: "Error obteniendo departamentos" });
  }
};

// POST /api/departamentos
export const createDepartamento = async (req: Request, res: Response) => {
  const { nombre } = req.body;

  if (!nombre || !nombre.trim()) {
    return res
      .status(400)
      .json({ message: "El nombre del departamento es obligatorio" });
  }

  try {
    const existing = await deptRepo.findOne({ where: { nombre } });
    if (existing) {
      return res.status(409).json({ message: "El departamento ya existe" });
    }

    const dept = deptRepo.create({ nombre: nombre.trim() });
    const saved = await deptRepo.save(dept);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error createDepartamento", err);
    res.status(500).json({ message: "Error creando departamento" });
  }
};

// PUT /api/departamentos/:id
export const updateDepartamento = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nombre } = req.body;

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  if (!nombre || !nombre.trim()) {
    return res
      .status(400)
      .json({ message: "El nombre del departamento es obligatorio" });
  }

  try {
    const dept = await deptRepo.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    const duplicate = await deptRepo.findOne({ where: { nombre } });
    if (duplicate && duplicate.id !== id) {
      return res
        .status(409)
        .json({ message: "Ya existe otro departamento con ese nombre" });
    }

    dept.nombre = nombre.trim();
    const updated = await deptRepo.save(dept);
    res.json(updated);
  } catch (err) {
    console.error("Error updateDepartamento", err);
    res.status(500).json({ message: "Error actualizando departamento" });
  }
};

// DELETE /api/departamentos/:id
export const deleteDepartamento = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const dept = await deptRepo.findOne({ where: { id } });
    if (!dept) {
      return res.status(404).json({ message: "Departamento no encontrado" });
    }

    await deptRepo.remove(dept);
    res.json({ message: "Departamento eliminado" });
  } catch (err) {
    console.error("Error deleteDepartamento", err);
    res.status(500).json({ message: "Error eliminando departamento" });
  }
};