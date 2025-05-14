// Import routes
import { todoRoutes } from './todo.routes.js';

const routeApi = (app, router) => {

  // Main route
  app.use('/api/v1', router);

  // Use routes
  router.use('/todos', todoRoutes(router));
  
  // Handle undefined routes
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
};

export { routeApi };