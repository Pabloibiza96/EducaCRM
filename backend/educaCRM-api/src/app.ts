import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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