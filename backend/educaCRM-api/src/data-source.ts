import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { Departamento } from "./entities/Departamento.js";
import { Persona } from "./entities/Persona.js";
import { Usuario } from "./entities/Usuario.js";
import { Alumno } from "./entities/Alumno.js";
import { Profesor } from "./entities/Profesor.js";
import { Asignatura } from "./entities/Asignatura.js";
import { Grupo } from "./entities/Grupo.js";
import { GrupoAsignatura } from "./entities/GrupoAsignatura.js";
import { Calificacion } from "./entities/Calificacion.js";
import { Matricula } from "./entities/Matricula.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "educacrm",
  synchronize: false,
  logging: false,

  entities: [
    __dirname + "/entities/*.js", 
    Departamento,
    Persona,
    Usuario,
    Alumno,
    Profesor,
    Asignatura,
    Grupo,
    GrupoAsignatura,
    Calificacion,
    Matricula
  ],
});