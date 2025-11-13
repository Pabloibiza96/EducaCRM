import express from 'express';
import cors from 'cors';
import alumnosRoutes from './routes/alumnos.routes.js';
import profesoresRoutes from './routes/profesores.routes.js';
import asignaturasRoutes from './routes/asignaturas.routes.js';
import calificacionesRoutes from './routes/calificaciones.routes.js';
import gruposRoutes from './routes/grupos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/asignaturas', asignaturasRoutes);
app.use('/api/calificaciones', calificacionesRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/usuarios', usuariosRoutes); 

app.get('/', (_req, res) => {
  res.send('✅ EducaCRM API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});