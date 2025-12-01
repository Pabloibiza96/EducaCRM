import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Calificacion } from "../entities/Calificacion.js";
import { Alumno } from "../entities/Alumno.js";

export async function getAlumnosMedias(req: Request, res: Response) {
  try {
    const calRepo = AppDataSource.getRepository(Calificacion);

    const rows = await calRepo
      .createQueryBuilder("c")
      .innerJoin("c.alumno", "al")
      .innerJoin("al.persona", "p")
      .leftJoin("al.matriculas", "m")
      .leftJoin("m.grupo", "g")
      .select("al.id", "alumnoId")
      .addSelect("p.nombre", "nombre")
      .addSelect("p.apellidos", "apellidos")
      .addSelect("g.nombre", "grupo")
      .addSelect("COUNT(*)", "numCalificaciones")
      .addSelect("ROUND(AVG(c.nota), 2)", "media")
      .groupBy("al.id")
      .addGroupBy("p.nombre")
      .addGroupBy("p.apellidos")
      .addGroupBy("g.nombre")
      .orderBy("p.apellidos", "ASC")
      .getRawMany();

    return res.json(rows);
  } catch (err) {
    console.error("Error obteniendo medias generales", err);
    return res.status(500).json({ message: "Error obteniendo medias" });
  }
}

export async function getResumenAlumno(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const calRepo = AppDataSource.getRepository(Calificacion);
    const alumRepo = AppDataSource.getRepository(Alumno);

    const alumno = await alumRepo.findOne({
      where: { id },
      relations: ["persona", "matriculas", "matriculas.grupo"],
    });

    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Medias por evaluación
    const mediasPorEvaluacion = await calRepo
      .createQueryBuilder("c")
      .select("c.evaluacion", "evaluacion")
      .addSelect("ROUND(AVG(c.nota), 2)", "media")
      .addSelect("COUNT(*)", "numCalificaciones")
      .where("c.alumno_id = :id", { id })
      .groupBy("c.evaluacion")
      .orderBy("c.evaluacion", "ASC")
      .getRawMany();

    // Medias por asignatura
    const mediasPorAsignatura = await calRepo
      .createQueryBuilder("c")
      .innerJoin("c.asignatura", "a")
      .select("a.id", "asignaturaId")
      .addSelect("a.nombre", "asignaturaNombre")
      .addSelect("ROUND(AVG(c.nota), 2)", "media")
      .addSelect("COUNT(*)", "numCalificaciones")
      .where("c.alumno_id = :id", { id })
      .groupBy("a.id")
      .addGroupBy("a.nombre")
      .orderBy("a.nombre", "ASC")
      .getRawMany();

    return res.json({
      alumno: {
        id: alumno.id,
        nombre: alumno.persona.nombre,
        apellidos: alumno.persona.apellidos,
        grupo: alumno.matriculas?.[0]?.grupo?.nombre ?? "—",
      },
      mediasPorEvaluacion,
      mediasPorAsignatura,
    });
  } catch (err) {
    console.error("Error obteniendo resumen de alumno", err);
    return res.status(500).json({
      message: "Error obteniendo resumen de alumno",
    });
  }
}
