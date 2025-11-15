import { Router } from "express";
import { getDepartamentos } from "../controllers/departamentos.controller.js";

const router = Router();

router.get("/", getDepartamentos);

export default router;