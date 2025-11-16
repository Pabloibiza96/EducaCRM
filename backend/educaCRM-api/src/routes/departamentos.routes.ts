import { Router } from "express";
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from "../controllers/departamentos.controller.js";

const router = Router();

router.get("/", getDepartamentos);
router.post("/", createDepartamento);
router.put("/:id", updateDepartamento);
router.delete("/:id", deleteDepartamento);

export default router;