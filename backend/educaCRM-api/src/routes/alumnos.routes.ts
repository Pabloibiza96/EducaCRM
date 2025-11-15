import { Router } from "express";
import { AlumnosController } from "../controllers/alumnos.controller.js";

const router = Router();

// GET /api/alumnos
router.get("/", AlumnosController.getAll);

// GET /api/alumnos/:id
router.get("/:id", AlumnosController.getOne);

// POST /api/alumnos
router.post("/", AlumnosController.create);

// PUT /api/alumnos/:id
router.put("/:id", AlumnosController.update);

// DELETE /api/alumnos/:id
router.delete("/:id", AlumnosController.remove);

export default router;