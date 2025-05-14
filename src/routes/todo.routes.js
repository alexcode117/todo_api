// Import the Todo controller
import { TodoController } from '../controllers/index.js';

const todoRoutes = (router) => {

  const controller = new TodoController();

  // Define the routes for the Todo API
  router.get('/todos', controller.getAllTodos.bind(controller));
  router.post('/todos', controller.createTodo.bind(controller));
  router.get('/todos/:id', controller.getTodoById.bind(controller));
  router.delete('/todos/:id', controller.deleteTodo.bind(controller));
  
  return router;
};

export { todoRoutes };