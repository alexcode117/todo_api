// Import the Todo controller
import { TodoController } from '../controllers/index.js';
import { validatorHandler } from '../middleware/validatorHandler.js';
import { TodoSchema } from '../schemas/todoSchemas.js';

const todoRoutes = (router) => {

  const controller = new TodoController();
  const schema = new TodoSchema();

  // Define the routes for the Todo AP  I
  router.get('/', controller.getAllTodos.bind(controller));
  router.post('/', validatorHandler(schema.createTodoSchema(), 'body'), controller.createTodo.bind(controller));
  router.get('/:id', validatorHandler(schema.getTodoSchema(), 'params'), controller.getTodoById.bind(controller));
  router.delete('/:id', validatorHandler(schema.deleteTodoSchema(), 'params'), controller.deleteTodo.bind(controller));
  
  return router;
};

export { todoRoutes };