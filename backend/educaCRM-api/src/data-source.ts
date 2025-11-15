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
import { Calificacion } from "./entities/Calificacion.js";
import { Matricula } from "./entities/Matricula.js";

// Crear __dirname manualmente en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",  
  database: "educacrm",
  synchronize: false,
  logging: true,
  entities: [__dirname + "/entities/*.ts",
    Departamento,
    Persona,
    Usuario,
    Alumno,
    Profesor,
    Asignatura,
    Grupo,
    Calificacion,
    Matricula
  ],
  
});