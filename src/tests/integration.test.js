import request from 'supertest';
import app from '../app.js';
import { TodoModel } from '../models/todo.model.js';

// Mock de Sequelize
jest.mock('../models/todo.model.js');

describe('API Integration Tests', () => {
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
    
    // Configurar los mocks de Sequelize
    TodoModel.findAll = jest.fn().mockResolvedValue([mockTodo]);
    TodoModel.findByPk = jest.fn().mockImplementation((id) => {
      if (id == 1) {
        return Promise.resolve({
          ...mockTodo,
          update: jest.fn().mockResolvedValue({
            ...mockTodo,
            title: 'Updated Title',
            completed: true,
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
  
  describe('GET /api/v1/todos', () => {
    it('debe devolver todos los todos con estado 200', async () => {
      const response = await request(app).get('/api/v1/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].title).toBe('Test Todo');
      expect(TodoModel.findAll).toHaveBeenCalledTimes(1);
    });
    
    it('debe manejar errores y devolver estado 500', async () => {
      // Simular un error en la base de datos
      TodoModel.findAll.mockRejectedValueOnce(new Error('Error de base de datos'));
      
      const response = await request(app).get('/api/v1/todos');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Error fetching todos');
    });
  });
  
  describe('GET /api/v1/todos/:id', () => {
    it('debe devolver un todo específico cuando existe', async () => {
      const response = await request(app).get('/api/v1/todos/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Test Todo');
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.findByPk).toHaveBeenCalledWith('1');
    });
    
    it('debe devolver 404 cuando el todo no existe', async () => {
      const response = await request(app).get('/api/v1/todos/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Todo no encontrado');
    });
  });
  
  describe('POST /api/v1/todos', () => {
    it('debe crear un nuevo todo y devolver estado 201', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send(newTodoData);
      
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(2);
      expect(response.body.title).toBe(newTodoData.title);
      expect(TodoModel.create).toHaveBeenCalledTimes(1);
      expect(TodoModel.create).toHaveBeenCalledWith(newTodoData);
    });
    
    it('debe devolver 400 cuando faltan datos obligatorios', async () => {
      const response = await request(app)
        .post('/api/v1/todos')
        .send({ description: 'Missing title' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(TodoModel.create).not.toHaveBeenCalled();
    });
  });
  
  describe('PATCH /api/v1/todos/:id', () => {
    it('debe actualizar un todo existente y devolver estado 200', async () => {
      const updateData = { title: 'Updated Title', completed: true };
      
      const response = await request(app)
        .patch('/api/v1/todos/1')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.completed).toBe(true);
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
    });
    
    it('debe devolver 404 cuando el todo a actualizar no existe', async () => {
      const updateData = { title: 'Updated Title' };
      
      const response = await request(app)
        .patch('/api/v1/todos/999')
        .send(updateData);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Todo no encontrado');
    });
    
    it('debe devolver 400 cuando los datos de actualización son inválidos', async () => {
      const invalidData = { title: 'a'.repeat(101) }; // Título demasiado largo
      
      const response = await request(app)
        .patch('/api/v1/todos/1')
        .send(invalidData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
  
  describe('DELETE /api/v1/todos/:id', () => {
    it('debe eliminar un todo existente y devolver estado 204', async () => {
      const response = await request(app).delete('/api/v1/todos/1');
      
      expect(response.status).toBe(204);
      expect(TodoModel.findByPk).toHaveBeenCalledTimes(1);
      expect(TodoModel.destroy).toHaveBeenCalledTimes(1);
    });
    
    it('debe devolver 404 cuando el todo a eliminar no existe', async () => {
      const response = await request(app).delete('/api/v1/todos/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Todo no encontrado');
    });
  });
  
  describe('Manejo de rutas inexistentes', () => {
    it('debe devolver 404 para rutas no definidas', async () => {
      const response = await request(app).get('/api/v1/ruta-inexistente');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});
