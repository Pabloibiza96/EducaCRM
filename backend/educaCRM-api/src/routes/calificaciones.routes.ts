import { Router } from "express";
import {
  getAllCalificaciones,
  getCalificacion,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion,
} from "../controllers/calificaciones.controller.js";

const router = Router();

router.get("/", getAllCalificaciones);
router.get("/:id", getCalificacion);
router.post("/", createCalificacion);
router.put("/:id", updateCalificacion);
router.delete("/:id", deleteCalificacion);

export default router;
