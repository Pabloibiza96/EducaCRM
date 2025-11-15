import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Calificacion } from "../entities/Calificacion.js";

const router = Router();
const califRepo = AppDataSource.getRepository(Calificacion);


router.get("/", async (_req, res) => {
  try {
    const califs = await califRepo.find(); // c
    res.json(califs);
  } catch (error) {
    console.error("Error obteniendo calificaciones", error);
    res.status(500).json({ message: "Error obteniendo calificaciones" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const calif = await califRepo.findOne({
      where: { id: Number(req.params.id) },
    });

    if (!calif) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    res.json(calif);
  } catch (error) {
    console.error("Error obteniendo calificación", error);
    res.status(500).json({ message: "Error obteniendo calificación" });
  }
});


router.get("/alumno/:id", async (req, res) => {
  try {
    const califs = await califRepo.find({
      where: { alumno: { id: Number(req.params.id) } },
      order: { fecha: "DESC" },
    });
    res.json(califs);
  } catch (error) {
    console.error("Error obteniendo calificaciones por alumno", error);
    res.status(500).json({ message: "Error obteniendo calificaciones por alumno" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { alumnoId, asignaturaId, evaluacion, nota, fecha } = req.body;

    const calif = califRepo.create({
      alumno: { id: alumnoId } as any,
      asignatura: { id: asignaturaId } as any,
      evaluacion,
      nota,
      fecha,
    });

    const saved = await califRepo.save(calif);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creando calificación", error);
    res.status(500).json({ message: "Error creando calificación" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { alumnoId, asignaturaId, evaluacion, nota, fecha } = req.body;

    const calif = await califRepo.findOne({ where: { id } });
    if (!calif) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    calif.alumno = { id: alumnoId } as any;
    calif.asignatura = { id: asignaturaId } as any;
    calif.evaluacion = evaluacion;
    calif.nota = nota;
    calif.fecha = fecha;

    const updated = await califRepo.save(calif);
    res.json(updated);
  } catch (error) {
    console.error("Error actualizando calificación", error);
    res.status(500).json({ message: "Error actualizando calificación" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await califRepo.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error eliminando calificación", error);
    res.status(500).json({ message: "Error eliminando calificación" });
  }
});

export default router;