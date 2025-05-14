// Este archivo configura el entorno para las pruebas
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { routeApi } from '../routes/index.js';

// Crear una aplicación Express para pruebas sin conectar a la base de datos
export const testApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json()); 
  app.use(morgan('dev'));
  
  // Routes
  routeApi(app, express.Router());
  
  return app;
}
