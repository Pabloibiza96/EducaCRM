import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Calificacion } from "../entities/Calificacion.js";
import { Alumno } from "../entities/Alumno.js";
import { Asignatura } from "../entities/Asignatura.js";
import { QueryFailedError } from "typeorm";
import {
  CalificacionDTO,
  CalificacionPayload,
} from "../models/CalificacionDTO.js";

const calRepo = AppDataSource.getRepository(Calificacion);
const alumRepo = AppDataSource.getRepository(Alumno);
const asigRepo = AppDataSource.getRepository(Asignatura);

function toDTO(c: Calificacion): CalificacionDTO {
  return {
    id: c.id,
    alumnoId: c.alumno.id,
    asignaturaId: c.asignatura.id,
    alumnoNombre: `${c.alumno.persona.nombre} ${c.alumno.persona.apellidos}`,
    asignaturaNombre: c.asignatura.nombre,
    evaluacion: c.evaluacion,
    nota: c.nota,
    fecha: c.fecha,
  };
}

function validatePayload(body: any): { ok: boolean; msg?: string } {
  const { alumnoId, asignaturaId, evaluacion, nota } =
    body as CalificacionPayload;

  if (!alumnoId || !asignaturaId || !evaluacion) {
    return {
      ok: false,
      msg: "Alumno, asignatura y evaluación son obligatorios",
    };
  }

  const validEvals = ["1ª", "2ª", "3ª", "Final"];
  if (!validEvals.includes(evaluacion)) {
    return { ok: false, msg: "Evaluación no válida" };
  }

  if (nota !== null && nota !== undefined) {
    const n = Number(nota);
    if (Number.isNaN(n) || n < 0 || n > 10) {
      return { ok: false, msg: "La nota debe estar entre 0 y 10" };
    }
  }

  return { ok: true };
}

/** GET /api/calificaciones */
export async function getAllCalificaciones(req: Request, res: Response) {
  try {
    const alumnoIdParam = req.query.alumnoId;
    let alumnoId: number | undefined;

    if (alumnoIdParam !== undefined) {
      alumnoId = Number(alumnoIdParam);
      if (Number.isNaN(alumnoId)) {
        return res.status(400).json({ message: "alumnoId inválido" });
      }
    }

    const list = await calRepo.find({
      where: alumnoId ? { alumno: { id: alumnoId } } : {},
      relations: ["alumno", "alumno.persona", "asignatura"],
    });
    return res.json(list.map(toDTO));
  } catch (err) {
    console.error("Error listando calificaciones", err);
    return res.status(500).json({ message: "Error listando calificaciones" });
  }
}

/** GET /api/calificaciones/:id */
export async function getCalificacion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const cal = await calRepo.findOne({
      where: { id },
      relations: ["alumno", "alumno.persona", "asignatura"],
    });
    if (!cal) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }
    return res.json(toDTO(cal));
  } catch (err) {
    console.error("Error obteniendo calificación", err);
    return res.status(500).json({ message: "Error obteniendo calificación" });
  }
}

/** POST /api/calificaciones */
export async function createCalificacion(req: Request, res: Response) {
  try {
    const body: CalificacionPayload = req.body;
    const validation = validatePayload(body);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.msg });
    }

    const alumno = await alumRepo.findOne({ where: { id: body.alumnoId } });
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    const asignatura = await asigRepo.findOne({
      where: { id: body.asignaturaId },
    });
    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    const cal = new Calificacion();
    cal.alumno = alumno;
    cal.asignatura = asignatura;
    cal.evaluacion = body.evaluacion as any;
    cal.nota =
      body.nota !== null && body.nota !== undefined ? Number(body.nota) : null;
    cal.fecha = body.fecha ?? null;

    const saved = await calRepo.save(cal);
    return res.status(201).json(toDTO(saved));
  } catch (err) {
    if (
      err instanceof QueryFailedError &&
      (err as any).code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        message:
          "Ya existe una calificación para ese alumno, asignatura y evaluación",
      });
    }
    console.error("Error creando calificación", err);
    return res.status(500).json({ message: "Error creando calificación" });
  }
}

/** PUT /api/calificaciones/:id */
export async function updateCalificacion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const body: CalificacionPayload = req.body;

    const cal = await calRepo.findOne({
      where: { id },
      relations: ["alumno", "asignatura"],
    });
    if (!cal) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    const validation = validatePayload({
      ...body,
      alumnoId: body.alumnoId ?? cal.alumno.id,
      asignaturaId: body.asignaturaId ?? cal.asignatura.id,
    });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.msg });
    }

    if (body.alumnoId) {
      const alumno = await alumRepo.findOne({ where: { id: body.alumnoId } });
      if (!alumno) {
        return res.status(404).json({ message: "Alumno no encontrado" });
      }
      cal.alumno = alumno;
    }

    if (body.asignaturaId) {
      const asig = await asigRepo.findOne({ where: { id: body.asignaturaId } });
      if (!asig) {
        return res.status(404).json({ message: "Asignatura no encontrada" });
      }
      cal.asignatura = asig;
    }

    if (body.evaluacion) cal.evaluacion = body.evaluacion as any;
    if (body.nota !== undefined) {
      cal.nota = body.nota !== null ? Number(body.nota) : null;
    }
    if (body.fecha !== undefined) {
      cal.fecha = body.fecha ?? null;
    }

    const saved = await calRepo.save(cal);
    return res.json(toDTO(saved));
  } catch (err) {
    if (
      err instanceof QueryFailedError &&
      (err as any).code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        message:
          "Ya existe una calificación para ese alumno, asignatura y evaluación",
      });
    }
    console.error("Error actualizando calificación", err);
    return res.status(500).json({ message: "Error actualizando calificación" });
  }
}

/** DELETE /api/calificaciones/:id */
export async function deleteCalificacion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const cal = await calRepo.findOne({ where: { id } });
    if (!cal) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    await calRepo.remove(cal);
    return res.status(204).send();
  } catch (err) {
    console.error("Error eliminando calificación", err);
    return res.status(500).json({ message: "Error eliminando calificación" });
  }
}
