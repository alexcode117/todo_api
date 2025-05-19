import { TodoController } from '../controllers/todo.controller.js';
import { TodoService } from '../services/todo.service.js';

// Mock del servicio
jest.mock('../services/todo.service.js');

describe('TodoController', () => {
  let todoController;
  let mockReq;
  let mockRes;
  let mockTodoService;
  
  // Datos de ejemplo para las pruebas
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const newTodoData = {
    title: 'New Todo',
    description: 'New Description',
    completed: false,
    dueDate: new Date().toISOString()
  };
  
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear mocks para req y res
    mockReq = {
      params: {},
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Crear mock para el servicio
    mockTodoService = {
      getAllTodos: jest.fn(),
      getTodoById: jest.fn(),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn()
    };
    
    // Crear instancia del controlador con el servicio mockeado
    todoController = new TodoController(mockTodoService);
  });
  
  describe('getAllTodos', () => {
    it('debe devolver todos los todos con estado 200', async () => {
      // Configurar el mock del servicio
      mockTodoService.getAllTodos.mockResolvedValue([mockTodo]);
      
      // Llamar al método del controlador
      await todoController.getAllTodos(mockReq, mockRes);
      
      // Verificar que se llamó al servicio
      expect(mockTodoService.getAllTodos).toHaveBeenCalledTimes(1);
      
      // Verificar la respuesta
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([mockTodo]);
    });
    
    it('debe manejar errores y devolver estado 500', async () => {
      // Configurar el mock del servicio para lanzar un error
      mockTodoService.getAllTodos.mockRejectedValue(new Error('Error en el servicio'));
      
      // Llamar al método del controlador
      await todoController.getAllTodos(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error fetching todos'
      }));
    });
  });
  
  describe('getTodoById', () => {
    it('debe devolver un todo específico con estado 200', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      
      // Configurar el mock del servicio
      mockTodoService.getTodoById.mockResolvedValue(mockTodo);
      
      // Llamar al método del controlador
      await todoController.getTodoById(mockReq, mockRes);
      
      // Verificar que se llamó al servicio con el ID correcto
      expect(mockTodoService.getTodoById).toHaveBeenCalledWith('1');
      
      // Verificar la respuesta
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTodo);
    });
    
    it('debe devolver 404 cuando el todo no existe', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '999';
      
      // Configurar el mock del servicio para lanzar un error específico
      mockTodoService.getTodoById.mockRejectedValue(new Error('Todo no encontrado'));
      
      // Llamar al método del controlador
      await todoController.getTodoById(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Todo no encontrado'
      }));
    });
    
    it('debe devolver 500 para otros errores', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      
      // Configurar el mock del servicio para lanzar un error genérico
      mockTodoService.getTodoById.mockRejectedValue(new Error('Error de base de datos'));
      
      // Llamar al método del controlador
      await todoController.getTodoById(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error al hacer fetching del todo'
      }));
    });
  });
  
  describe('createTodo', () => {
    it('debe crear un nuevo todo y devolver estado 201', async () => {
      // Configurar el mock de la solicitud
      mockReq.body = newTodoData;
      
      // Configurar el mock del servicio
      mockTodoService.createTodo.mockResolvedValue({
        id: 2,
        ...newTodoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Llamar al método del controlador
      await todoController.createTodo(mockReq, mockRes);
      
      // Verificar que se llamó al servicio con los datos correctos
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(newTodoData);
      
      // Verificar la respuesta
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 2,
        title: newTodoData.title
      }));
    });
    
    it('debe devolver 400 cuando falta el título', async () => {
      // Configurar el mock de la solicitud sin título
      mockReq.body = {
        description: 'Missing title',
        completed: false,
        dueDate: new Date().toISOString()
      };
      
      // Llamar al método del controlador
      await todoController.createTodo(mockReq, mockRes);
      
      // Verificar que no se llamó al servicio
      expect(mockTodoService.createTodo).not.toHaveBeenCalled();
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'El título es obligatorio'
      }));
    });
    
    it('debe manejar errores y devolver estado 500', async () => {
      // Configurar el mock de la solicitud
      mockReq.body = newTodoData;
      
      // Configurar el mock del servicio para lanzar un error
      mockTodoService.createTodo.mockRejectedValue(new Error('Error al crear todo'));
      
      // Llamar al método del controlador
      await todoController.createTodo(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error creating todo'
      }));
    });
  });
  
  describe('updateTodo', () => {
    it('debe actualizar un todo existente y devolver estado 200', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      mockReq.body = { title: 'Updated Title', completed: true };
      
      // Configurar el mock del servicio
      mockTodoService.updateTodo.mockResolvedValue({
        ...mockTodo,
        title: 'Updated Title',
        completed: true,
        updatedAt: new Date().toISOString()
      });
      
      // Llamar al método del controlador
      await todoController.updateTodo(mockReq, mockRes);
      
      // Verificar que se llamó al servicio con los datos correctos
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith('1', mockReq.body);
      
      // Verificar la respuesta
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        title: 'Updated Title',
        completed: true
      }));
    });
    
    it('debe devolver 404 cuando el todo a actualizar no existe', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '999';
      mockReq.body = { title: 'Updated Title' };
      
      // Configurar el mock del servicio para lanzar un error específico
      mockTodoService.updateTodo.mockRejectedValue(new Error('Todo no encontrado'));
      
      // Llamar al método del controlador
      await todoController.updateTodo(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Todo no encontrado'
      }));
    });
    
    it('debe devolver 500 para otros errores', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      mockReq.body = { title: 'Updated Title' };
      
      // Configurar el mock del servicio para lanzar un error genérico
      mockTodoService.updateTodo.mockRejectedValue(new Error('Error de base de datos'));
      
      // Llamar al método del controlador
      await todoController.updateTodo(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error updating todo'
      }));
    });
  });
  
  describe('deleteTodo', () => {
    it('debe eliminar un todo existente y devolver estado 204', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      
      // Configurar el mock del servicio
      mockTodoService.deleteTodo.mockResolvedValue();
      
      // Llamar al método del controlador
      await todoController.deleteTodo(mockReq, mockRes);
      
      // Verificar que se llamó al servicio con el ID correcto
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith('1');
      
      // Verificar la respuesta
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.json).toHaveBeenCalled();
    });
    
    it('debe devolver 404 cuando el todo a eliminar no existe', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '999';
      
      // Configurar el mock del servicio para lanzar un error específico
      mockTodoService.deleteTodo.mockRejectedValue(new Error('Todo no encontrado'));
      
      // Llamar al método del controlador
      await todoController.deleteTodo(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Todo no encontrado'
      }));
    });
    
    it('debe devolver 500 para otros errores', async () => {
      // Configurar el mock de la solicitud
      mockReq.params.id = '1';
      
      // Configurar el mock del servicio para lanzar un error genérico
      mockTodoService.deleteTodo.mockRejectedValue(new Error('Error de base de datos'));
      
      // Llamar al método del controlador
      await todoController.deleteTodo(mockReq, mockRes);
      
      // Verificar la respuesta de error
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error deleting todo'
      }));
    });
  });
});
