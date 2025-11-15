import { Router } from "express";
import { getPersonas, getPersonaById } from "../controllers/personas.controller.js";

const router = Router();

// GET /api/personas
router.get("/", getPersonas);

// GET /api/personas/:id
router.get("/:id", getPersonaById);

export default router;