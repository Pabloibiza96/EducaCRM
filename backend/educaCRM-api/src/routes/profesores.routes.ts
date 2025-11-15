import { Router } from "express";
import { getProfesores, getProfesorById } from "../controllers/profesores.controller.js";

const router = Router();

router.get("/", getProfesores);
router.get("/:id", getProfesorById);

export default router;