import { Router } from "express";
import { AppDataSource } from "../data-source.js";
import { Grupo } from "../entities/Grupo.js";

const router = Router();
const grupoRepo = AppDataSource.getRepository(Grupo);

// GET /api/grupos
router.get("/", async (_req, res) => {
  try {
    const grupos = await grupoRepo.find();
    res.json(grupos);
  } catch (error) {
    console.error("Error obteniendo grupos", error);
    res.status(500).json({ message: "Error obteniendo grupos" });
  }
});

// GET /api/grupos/:id
router.get("/:id", async (req, res) => {
  try {
    const grupo = await grupoRepo.findOneBy({ id: Number(req.params.id) });

    if (!grupo) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    res.json(grupo);
  } catch (error) {
    console.error("Error obteniendo grupo", error);
    res.status(500).json({ message: "Error obteniendo grupo" });
  }
});

export default router;