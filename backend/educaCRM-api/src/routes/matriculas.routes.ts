import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Matricula } from "../entities/Matricula.js";

const router = Router();
const matriculaRepo = AppDataSource.getRepository(Matricula);


router.get("/alumno/:id", async (req, res) => {
  try {
    const alumnoId = Number(req.params.id);
    const matriculas = await matriculaRepo.find({
      where: { alumno: { id: alumnoId } },
      order: { fecha: "DESC" },
    });
    res.json(matriculas);
  } catch (error) {
    console.error("Error obteniendo matrículas por alumno", error);
    res.status(500).json({ message: "Error obteniendo matrículas por alumno" });
  }
});


router.get("/grupo/:id", async (req, res) => {
  try {
    const grupoId = Number(req.params.id);
    const matriculas = await matriculaRepo.find({
      where: { grupo: { id: grupoId } },
      order: { fecha: "DESC" },
    });
    res.json(matriculas);
  } catch (error) {
    console.error("Error obteniendo matrículas por grupo", error);
    res.status(500).json({ message: "Error obteniendo matrículas por grupo" });
  }
});


router.get("/", async (_req, res) => {
  try {
    const matriculas = await matriculaRepo.find({
      order: { fecha: "DESC" },
    });
    res.json(matriculas);
  } catch (error) {
    console.error("Error obteniendo matrículas", error);
    res.status(500).json({ message: "Error obteniendo matrículas" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const matricula = await matriculaRepo.findOne({
      where: { id },
    });

    if (!matricula) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    res.json(matricula);
  } catch (error) {
    console.error("Error obteniendo matrícula", error);
    res.status(500).json({ message: "Error obteniendo matrícula" });
  }
});

export default router;