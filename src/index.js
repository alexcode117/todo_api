/**
 * @fileoverview Punto de entrada principal para la API REST TODO LIST
 * @module api-rest-todo-list
 * @requires dotenv
 * @requires express
 * @requires sequelize
 * @requires joi
 */

/**
 * @namespace Controllers
 * @description Controladores que manejan las solicitudes HTTP
 */

/**
 * @namespace Services
 * @description Servicios que contienen la lógica de negocio
 */

/**
 * @namespace Models
 * @description Modelos de datos que interactúan con la base de datos
 */

/**
 * @namespace Routes
 * @description Rutas que definen los endpoints de la API
 */

/**
 * @namespace Schemas
 * @description Esquemas de validación para los datos
 */

/**
 * @namespace Middleware
 * @description Middleware para procesar solicitudes
 */

/**
 * @namespace Config
 * @description Configuración de la aplicación
 */

import { config } from "./src/config/config.js";
import { app } from "./src/app.js";

/**
 * Inicia el servidor HTTP
 * @async
 * @function startServer
 * @returns {Promise<void>}
 * @throws {Error} Si hay un error al iniciar el servidor
 */
async function startServer(){
  try {
    app.listen(config.port, () => {
      console.log(`Server is running on port🚀 ${config.port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
