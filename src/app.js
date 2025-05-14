import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initModels } from './models/init.models.js';
import { routeApi } from './routes/index.js';

// Inicializar la base de datos y los modelos
await initModels();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

// Routes
routeApi(app, express.Router());

export { app };
