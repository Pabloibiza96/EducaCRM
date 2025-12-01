import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Profesor } from "../entities/Profesor.js";
import { Persona } from "../entities/Persona.js";
import { Departamento } from "../entities/Departamento.js";

const profesorRepo = AppDataSource.getRepository(Profesor);
const personaRepo = AppDataSource.getRepository(Persona);
const deptRepo = AppDataSource.getRepository(Departamento);

// GET /api/profesores
export const getProfesores = async (_req: Request, res: Response) => {
  try {
    const profesores = await profesorRepo
      .createQueryBuilder("prof")
      .leftJoinAndSelect("prof.persona", "persona")
      .leftJoinAndSelect("prof.departamento", "departamento")
      .orderBy("persona.apellidos", "ASC")
      .getMany();

    const dto = profesores.map((p) => ({
      id: p.id,
      nombre: p.persona?.nombre ?? "",
      apellidos: p.persona?.apellidos ?? "",
      email: p.persona?.email ?? null,
      departamento: p.departamento?.nombre ?? null,
      departamentoId: p.departamento?.id ?? null,
    }));

    res.json(dto);
  } catch (err) {
    console.error("Error getProfesores", err);
    res.status(500).json({ message: "Error obteniendo profesores" });
  }
};

// POST /api/profesores
export const createProfesor = async (req: Request, res: Response) => {
  const { nombre, apellidos, email, departamentoId } = req.body;

  if (!nombre || !apellidos) {
    return res
      .status(400)
      .json({ message: "Nombre y apellidos son obligatorios" });
  }

  try {
    const result = await AppDataSource.transaction(async (manager) => {
      // 1) Buscar departamento por ID
      let depEntity: Departamento | null = null;
      if (departamentoId) {
        const depRepoTx = manager.getRepository(Departamento);
        depEntity = await depRepoTx.findOne({ where: { id: departamentoId } });
      }

      // 2) Crear persona
      const personaRepoTx = manager.getRepository(Persona);
      const persona = personaRepoTx.create({
        dni: `TMP-${Date.now()}`, // simplificado para el proyecto
        nombre,
        apellidos,
        email: email ?? null,
      });
      await personaRepoTx.save(persona);

      // 3) Crear profesor enlazado
      const profRepoTx = manager.getRepository(Profesor);
      const profesor = profRepoTx.create({
        id: persona.id,
        fechaAlta: new Date().toISOString().slice(0, 10),
        departamento: depEntity ?? null,
      });
      await profRepoTx.save(profesor);

      // 4) Volver a cargar con joins para devolver DTO
      const loaded = await profRepoTx.findOne({
        where: { id: profesor.id },
        relations: ["persona", "departamento"],
      });

      return {
        id: loaded!.id,
        nombre: loaded!.persona?.nombre ?? "",
        apellidos: loaded!.persona?.apellidos ?? "",
        email: loaded!.persona?.email ?? null,
        departamento: loaded!.departamento?.nombre ?? null,
        departamentoId: loaded!.departamento?.id ?? null,
      };
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Error createProfesor", err);
    res.status(500).json({ message: "Error creando profesor" });
  }
};

// PUT /api/profesores/:id
export const updateProfesor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nombre, apellidos, email, departamentoId } = req.body;

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const result = await AppDataSource.transaction(async (manager) => {
      const profRepoTx = manager.getRepository(Profesor);
      const personaRepoTx = manager.getRepository(Persona);
      const depRepoTx = manager.getRepository(Departamento);

      const profesor = await profRepoTx.findOne({
        where: { id },
        relations: ["persona", "departamento"],
      });

      if (!profesor) {
        return null;
      }

      // Actualizar persona
      if (nombre !== undefined) profesor.persona.nombre = nombre;
      if (apellidos !== undefined) profesor.persona.apellidos = apellidos;
      if (email !== undefined) profesor.persona.email = email;

      await personaRepoTx.save(profesor.persona);

      // Actualizar departamento (por ID)
      if (departamentoId !== undefined) {
        if (departamentoId === null) {
          profesor.departamento = null;
        } else {
          const dep = await depRepoTx.findOne({ where: { id: departamentoId } });
          if (dep) {
            profesor.departamento = dep;
          }
        }
        await profRepoTx.save(profesor);
      }

      const updated = await profRepoTx.findOne({
        where: { id },
        relations: ["persona", "departamento"],
      });

      return updated
        ? {
            id: updated.id,
            nombre: updated.persona?.nombre ?? "",
            apellidos: updated.persona?.apellidos ?? "",
            email: updated.persona?.email ?? null,
            departamento: updated.departamento?.nombre ?? null,
            departamentoId: updated.departamento?.id ?? null,
          }
        : null;
    });

    if (!result) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error updateProfesor", err);
    res.status(500).json({ message: "Error actualizando profesor" });
  }
};

// DELETE /api/profesores/:id
export const deleteProfesor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const profesor = await profesorRepo.findOne({ where: { id } });
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }

    await profesorRepo.remove(profesor);
    // (Si quieres borrar también persona asociada, se podría hacer otro paso extra)

    res.json({ message: "Profesor eliminado" });
  } catch (err) {
    console.error("Error deleteProfesor", err);
    res.status(500).json({ message: "Error eliminando profesor" });
  }
};