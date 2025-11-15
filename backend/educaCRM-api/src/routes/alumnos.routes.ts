import { Router } from "express";
import { getAlumnos, getAlumnoById } from "../controllers/alumnos.controller.js";

const router = Router();

router.get("/", getAlumnos);
router.get("/:id", getAlumnoById);

export default router;