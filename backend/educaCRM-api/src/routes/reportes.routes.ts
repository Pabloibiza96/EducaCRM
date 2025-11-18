import { Router } from "express";
import { getAlumnosMedias, getResumenAlumno } from "../controllers/reportes.controller.js";


const router = Router();

// /api/reportes/alumnos-medias
router.get("/alumnos-medias", getAlumnosMedias);
router.get("/alumnos/:id/resumen", getResumenAlumno);
export default router;