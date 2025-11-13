import "reflect-metadata";
import { DataSource } from "typeorm";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
  entities: [__dirname + "/entities/*.ts"],
});