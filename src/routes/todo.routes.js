// Import the Todo controller
import { TodoController } from '../controllers/index.js';
import { validatorHandler } from '../middleware/validatorHandler.js';

const todoRoutes = (router) => {

  const controller = new TodoController();

  // Define the routes for the Todo API
  router.get('/', controller.getAllTodos.bind(controller));
  router.post('/', validatorHandler(createTodoSchema, 'body'), controller.createTodo.bind(controller));
  router.get('/:id', validatorHandler(getTodoSchema, 'params'), controller.getTodoById.bind(controller));
  router.delete('/:id', validatorHandler(deleteTodoSchema, 'params'), controller.deleteTodo.bind(controller));
  
  return router;
};

export { todoRoutes };