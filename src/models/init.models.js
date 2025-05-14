import { db } from '../config/db.js';
import { TodoModel } from './todo.model.js';

// Inicializar modelos
const initModels = async () => {
  try {
    // Autenticar la conexión a la base de datos
    await db.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos con la base de datos
    // force: true recreará las tablas (elimina datos existentes)
    // alter: true actualiza las tablas si es necesario
    await db.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos.');
    
    return {
      db,
      models: {
        Todo: TodoModel
      }
    };
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

export { initModels };