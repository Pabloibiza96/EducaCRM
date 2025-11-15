import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Alumno } from "../entities/Alumno.js";

export const getAlumnos = async (_req: Request, res: Response) => {
  try {
    // Usamos query raw para juntar personas + alumnos + grupo
    const result = await AppDataSource.getRepository(Alumno).query(
      `
      SELECT 
        a.id AS id,
        p.nombre AS nombre,
        p.apellidos AS apellidos,
        p.email AS email,
        g.nombre AS grupo
      FROM alumnos a
      INNER JOIN personas p ON p.id = a.id
      LEFT JOIN matriculas m ON m.alumno_id = a.id
      LEFT JOIN grupos g ON g.id = m.grupo_id
      ORDER BY p.apellidos, p.nombre
      `
    );

    res.json(result);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ error: "Error al obtener alumnos" });
  }
};

export const getAlumnoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const rows = await AppDataSource.getRepository(Alumno).query(
      `
      SELECT 
        a.id AS id,
        p.nombre AS nombre,
        p.apellidos AS apellidos,
        p.email AS email,
        g.nombre AS grupo
      FROM alumnos a
      INNER JOIN personas p ON p.id = a.id
      LEFT JOIN matriculas m ON m.alumno_id = a.id
      LEFT JOIN grupos g ON g.id = m.grupo_id
      WHERE a.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    res.status(500).json({ error: "Error al obtener alumno" });
  }
};