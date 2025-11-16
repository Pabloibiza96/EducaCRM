import { Router } from "express";
import {
  getAsignaturas,
  getAsignatura,
  createAsignatura,
  updateAsignatura,
  deleteAsignatura,
} from "../controllers/asignaturas.controller.js";

const router = Router();

router.get("/", getAsignaturas);
router.get("/:id", getAsignatura);
router.post("/", createAsignatura);
router.put("/:id", updateAsignatura);
router.delete("/:id", deleteAsignatura);

export default router;