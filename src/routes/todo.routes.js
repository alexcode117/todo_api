// Import the Todo controller
import { TodoController } from '../controllers/index.js';
import { validatorHandler } from '../middleware/validatorHandler.js';
import { TodoSchema } from '../schemas/todoSchemas.js';

/**
 * Configura las rutas para la API de todos
 * Define los endpoints y los controladores asociados a cada operación CRUD
 * Implementa validación de datos para cada ruta según corresponda
 * 
 * @param {Express.Router} router - Router de Express para definir las rutas
 * @returns {Express.Router} Router configurado con todas las rutas de todos
 */
const todoRoutes = (router) => {

  const controller = new TodoController();
  const schema = new TodoSchema();

  // Define the routes for the Todo API
  /**
   * @swagger
   * /todos:
   *   get:
   *     summary: Obtiene todas las tareas
   *     description: Retorna un array con todas las tareas ordenadas por fecha de creación descendente
   *     tags: [Todos]
   *     responses:
   *       200:
   *         description: Lista de tareas obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Todo'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/', controller.getAllTodos.bind(controller));
  
  /**
   * @swagger
   * /todos:
   *   post:
   *     summary: Crea una nueva tarea
   *     description: Crea una nueva tarea con los datos proporcionados
   *     tags: [Todos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, description, completed, dueDate]
   *             properties:
   *               title:
   *                 type: string
   *                 description: Título de la tarea
   *               description:
   *                 type: string
   *                 description: Descripción detallada de la tarea
   *               completed:
   *                 type: boolean
   *                 description: Estado de completitud de la tarea
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *                 description: Fecha límite para completar la tarea
   *     responses:
   *       201:
   *         description: Tarea creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.post('/', validatorHandler(schema.createTodoSchema(), 'body'), controller.createTodo.bind(controller));
  
  /**
   * @swagger
   * /todos/{id}:
   *   get:
   *     summary: Obtiene una tarea por su ID
   *     description: Retorna una tarea específica según el ID proporcionado
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de la tarea a obtener
   *     responses:
   *       200:
   *         description: Tarea obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.get('/:id', validatorHandler(schema.getTodoSchema(), 'params'), controller.getTodoById.bind(controller));
  
  /**
   * @swagger
   * /todos/{id}:
   *   patch:
   *     summary: Actualiza parcialmente una tarea
   *     description: Actualiza los campos especificados de una tarea existente
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de la tarea a actualizar
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Nuevo título de la tarea
   *               description:
   *                 type: string
   *                 description: Nueva descripción de la tarea
   *               completed:
   *                 type: boolean
   *                 description: Nuevo estado de completitud
   *               dueDate:
   *                 type: string
   *                 format: date-time
   *                 description: Nueva fecha límite
   *     responses:
   *       200:
   *         description: Tarea actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Todo'
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.patch('/:id', 
    validatorHandler(schema.updateTodoSchema(), 'params'),
    validatorHandler(schema.updateTodoBodySchema(), 'body'),
    controller.updateTodo.bind(controller)
  );
  
  /**
   * @swagger
   * /todos/{id}:
   *   delete:
   *     summary: Elimina una tarea
   *     description: Elimina una tarea existente según el ID proporcionado
   *     tags: [Todos]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de la tarea a eliminar
   *     responses:
   *       204:
   *         description: Tarea eliminada exitosamente
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  router.delete('/:id', validatorHandler(schema.deleteTodoSchema(), 'params'), controller.deleteTodo.bind(controller));
  
  return router;
};

export { todoRoutes };