import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source.js';
import departamentosRoutes from "./routes/departamentos.routes.js";
import personasRoutes from "./routes/personas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import profesoresRoutes from "./routes/profesores.routes.js";
import asignaturasRoutes from "./routes/asignaturas.routes.js";
import gruposRoutes from "./routes/grupos.routes.js";  
import calificacionesRoutes from "./routes/calificaciones.routes.js"; 
import matriculasRoutes from "./routes/matriculas.routes.js";
import authRoutes from "./routes/auth.routes.js";   
import reportesRoutes from "./routes/reportes.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/departamentos", departamentosRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/profesores", profesoresRoutes);
app.use("/api/asignaturas", asignaturasRoutes);
app.use("/api/grupos", gruposRoutes);
app.use("/api/calificaciones", calificacionesRoutes);
app.use("/api/matriculas", matriculasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportesRoutes);

// Inicializar TypeORM y luego arrancar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log('📚 Base de datos conectada con TypeORM');

    // Ruta de prueba
    app.get('/', (_req, res) => {
      res.send('API corriendo y BBDD conectada ✔');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(' Error al inicializar TypeORM', error);
  });