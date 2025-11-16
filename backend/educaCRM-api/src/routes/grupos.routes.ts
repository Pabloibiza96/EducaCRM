import { Router } from "express";
import {
  getGrupos,
  createGrupo,
  updateGrupo,
  deleteGrupo,
} from "../controllers/grupos.controller.js";

const router = Router();

router.get("/", getGrupos);
router.post("/", createGrupo);
router.put("/:id", updateGrupo);
router.delete("/:id", deleteGrupo);

export default router;
