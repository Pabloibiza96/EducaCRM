import { Request, Response } from "express";
import {
  AlumnoService,
  AlumnoCreateUpdateDTO,
} from "../services/alumno.services.js";

const service = new AlumnoService();

export class AlumnosController {
  static async getAll(_req: Request, res: Response) {
    try {
      const data = await service.getAll();
      res.json(data);
    } catch (err) {
      console.error("Error getAll alumnos", err);
      res.status(500).json({ message: "Error obteniendo alumnos" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const alumno = await service.getOne(id);
      if (!alumno) {
        return res.status(404).json({ message: "Alumno no encontrado" });
      }

      res.json(alumno);
    } catch (err) {
      console.error("Error getOne alumno", err);
      res.status(500).json({ message: "Error obteniendo alumno" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const body = req.body as AlumnoCreateUpdateDTO;

      if (!body.nombre || !body.apellidos) {
        return res
          .status(400)
          .json({ message: "Nombre y apellidos son obligatorios" });
      }

      const creado = await service.create(body);
      res.status(201).json(creado);
    } catch (err) {
      console.error("Error create alumno", err);
      res.status(500).json({ message: "Error creando alumno" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const body = req.body as AlumnoCreateUpdateDTO;

      if (!body.nombre || !body.apellidos) {
        return res
          .status(400)
          .json({ message: "Nombre y apellidos son obligatorios" });
      }

      const actualizado = await service.update(id, body);
      if (!actualizado) {
        return res.status(404).json({ message: "Alumno no encontrado" });
      }

      res.json(actualizado);
    } catch (err) {
      console.error("Error update alumno", err);
      res.status(500).json({ message: "Error actualizando alumno" });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const ok = await service.delete(id);
      if (!ok) {
        return res.status(404).json({ message: "Alumno no encontrado" });
      }

      res.status(204).send();
    } catch (err) {
      console.error("Error delete alumno", err);
      res.status(500).json({ message: "Error eliminando alumno" });
    }
  }
}