import { TodoService } from '../services/todo.service.js';
import { TodoModel } from '../models/todo.model.js';

// Mock de Sequelize
jest.mock('../models/todo.model.js');

describe('TodoService', () => {
  let todoService;
  
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
    
    // Crear una nueva instancia del servicio para cada prueba
    todoService = new TodoService();
    
    // Configurar los mocks de Sequelize
    TodoModel.findAll = jest.fn().mockResolvedValue([mockTodo]);
    TodoModel.findByPk = jest.fn().mockImplementation((id) => {
      if (id == 1) {
        return Promise.resolve({
          ...mockTodo,
          update: jest.fn().mockResolvedValue({
            ...mockTodo,
            ...newTodoData,
            updatedAt: new Date().toISOString()
          })
        });
      } else {
        return Promise.resolve(null);
      }
    });
    TodoModel.create = jest.fn().mockResolvedValue({
      id: 2,
      ...newTodoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    TodoModel.destroy = jest.fn().mockResolvedValue(1); // 1 registro eliminado
  });
  
  describe('getAllTodos', () => {
    it('debe devolver todos los todos', async () => {
      const result = await todoService.getAllTodos();
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Test Todo');
      expect(TodoModel.findAll).toHaveBeenCalledTimes(1);
      expect(TodoModel.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']]
      });
    });
    
    it('debe manejar errores al obtener todos', async () => {
      // Simular un error en la base de datos
      TodoModel.findAll.mockRejectedValueOnce(new Error('Error de base de datos'));
      
      await expect(todoService.getAllTodos()).rejects.toThrow('Error de base de datos');
      expect(TodoModel.findAll).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('getTodoById', () => {
    it('debe devolver un todo específico cuando existe', async () => {
      const result = await todoService.getTodoById(1);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Todo');
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(1);
    });
    
    it('debe lanzar un error cuando el todo no existe', async () => {
      await expect(todoService.getTodoById(999)).rejects.toThrow('Todo no encontrado');
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(999);
    });
  });
  
  describe('createTodo', () => {
    it('debe crear un nuevo todo', async () => {
      const result = await todoService.createTodo(newTodoData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(2);
      expect(result.title).toBe(newTodoData.title);
      expect(result.description).toBe(newTodoData.description);
      expect(TodoModel.create).toHaveBeenCalledTimes(1);
      expect(TodoModel.create).toHaveBeenCalledWith(newTodoData);
    });
    
    it('debe manejar errores al crear un todo', async () => {
      // Simular un error en la base de datos
      TodoModel.create.mockRejectedValueOnce(new Error('Error al crear todo'));
      
      await expect(todoService.createTodo(newTodoData)).rejects.toThrow('Error al crear todo');
      expect(TodoModel.create).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('updateTodo', () => {
    it('debe actualizar un todo existente', async () => {
      const updateData = { title: 'Updated Title', completed: true };
      const result = await todoService.updateTodo(1, updateData);
      
      expect(result).toBeDefined();
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(1);
    });
    
    it('debe lanzar un error cuando el todo a actualizar no existe', async () => {
      const updateData = { title: 'Updated Title' };
      
      await expect(todoService.updateTodo(999, updateData)).rejects.toThrow('Todo no encontrado');
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(999);
    });
  });
  
  describe('deleteTodo', () => {
    it('debe eliminar un todo existente', async () => {
      await todoService.deleteTodo(1);
      
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(1);
      expect(TodoModel.destroy).toHaveBeenCalledTimes(1);
      expect(TodoModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    
    it('debe lanzar un error cuando el todo a eliminar no existe', async () => {
      await expect(todoService.deleteTodo(999)).rejects.toThrow('Todo no encontrado');
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith(999);
      expect(TodoModel.destroy).not.toHaveBeenCalled();
    });
  });
});
