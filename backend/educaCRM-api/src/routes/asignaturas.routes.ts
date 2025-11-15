import { Router } from "express";
import { getAsignaturas, getAsignaturaById } from "../controllers/asignaturas.controller.js";

const router = Router();

router.get("/", getAsignaturas);
router.get("/:id", getAsignaturaById);

export default router;