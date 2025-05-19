// Import routes
import { todoRoutes } from './todo.routes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger.js';

/**
 * Configura todas las rutas de la API
 * @param {Express.Application} app - Aplicación Express
 * @param {Express.Router} router - Router de Express
 */
const routeApi = (app, router) => {

  // Swagger documentation route
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    }
  }));

  // Main route
  app.use('/api/v1/todos', router);

  // Use routes
  router.use('/', todoRoutes(router));
  
  // Handle undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
};

export { routeApi };