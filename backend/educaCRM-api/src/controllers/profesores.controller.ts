import { Request, Response } from "express";
import { AppDataSource } from "../data-source.js";
import { Profesor } from "../entities/Profesor.js";

export const getProfesores = async (_req: Request, res: Response) => {
  try {
    const rows = await AppDataSource.getRepository(Profesor).query(
      `
      SELECT 
        pr.id AS id,
        p.nombre AS nombre,
        p.apellidos AS apellidos,
        p.email AS email,
        d.nombre AS departamento,
        GROUP_CONCAT(DISTINCT asig.nombre ORDER BY asig.nombre SEPARATOR ', ') AS asignaturas
      FROM profesores pr
      INNER JOIN personas p ON p.id = pr.id
      LEFT JOIN departamentos d ON d.id = pr.departamento_id
      LEFT JOIN grupo_asignatura ga ON ga.profesor_id = pr.id
      LEFT JOIN asignaturas asig ON asig.id = ga.asignatura_id
      GROUP BY pr.id, p.nombre, p.apellidos, p.email, d.nombre
      ORDER BY p.apellidos, p.nombre
      `
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    res.status(500).json({ error: "Error al obtener profesores" });
  }
};

export const getProfesorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const rows = await AppDataSource.getRepository(Profesor).query(
      `
      SELECT 
        pr.id AS id,
        p.nombre AS nombre,
        p.apellidos AS apellidos,
        p.email AS email,
        d.nombre AS departamento,
        GROUP_CONCAT(DISTINCT asig.nombre ORDER BY asig.nombre SEPARATOR ', ') AS asignaturas
      FROM profesores pr
      INNER JOIN personas p ON p.id = pr.id
      LEFT JOIN departamentos d ON d.id = pr.departamento_id
      LEFT JOIN grupo_asignatura ga ON ga.profesor_id = pr.id
      LEFT JOIN asignaturas asig ON asig.id = ga.asignatura_id
      WHERE pr.id = ?
      GROUP BY pr.id, p.nombre, p.apellidos, p.email, d.nombre
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profesor no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener profesor:", error);
    res.status(500).json({ error: "Error al obtener profesor" });
  }
};