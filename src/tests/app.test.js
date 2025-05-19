import request from 'supertest';
import { testApp } from './setup.js';
import { sequelize } from '../config/db.js';

// Mock de la conexión a la base de datos
jest.mock('../config/db.js', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(true)
  }
}));

// Crear una instancia de la aplicación para pruebas
const app = testApp();

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

const updateTodoData = {
  title: 'Updated Todo',
  completed: true
};

// Mock para los servicios
jest.mock('../services/todo.service.js', () => ({
  TodoService: jest.fn().mockImplementation(() => ({
    // Mock para getAllTodos
    getAllTodos: jest.fn().mockResolvedValue([mockTodo]),
    
    // Mock para getTodoById
    getTodoById: jest.fn().mockImplementation((id) => {
      if (id == 1) {
        return Promise.resolve(mockTodo);
      } else {
        return Promise.reject(new Error('Todo no encontrado'));
      }
    }),
    
    // Mock para createTodo
    createTodo: jest.fn().mockImplementation((todoData) => {
      return Promise.resolve({
        id: 2,
        ...todoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }),
    
    // Mock para updateTodo
    updateTodo: jest.fn().mockImplementation((id, todoData) => {
      if (id == 1) {
        return Promise.resolve({
          ...mockTodo,
          ...todoData,
          updatedAt: new Date().toISOString()
        });
      } else {
        return Promise.reject(new Error('Todo no encontrado'));
      }
    }),
    
    // Mock para deleteTodo
    deleteTodo: jest.fn().mockImplementation((id) => {
      if (id == 1) {
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Todo no encontrado'));
      }
    })
  }))
}));

// Cerrar conexiones después de todas las pruebas
afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Dar tiempo para que se completen las operaciones pendientes
  jest.clearAllMocks();
  await sequelize.close();
});

// Test de la ruta GET /todos
describe('GET /api/v1/todos', () => {
  it('debe devolver todos los todos', async () => {
    const response = await request(app).get('/api/v1/todos');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe(1);
    expect(response.body[0].title).toBe('Test Todo');
  });
});

// Test de la ruta GET /todos/:id
describe('GET /api/v1/todos/:id', () => {
  it('debe devolver un todo específico cuando existe', async () => {
    const response = await request(app).get('/api/v1/todos/1');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
    expect(response.body.title).toBe('Test Todo');
  });

  it('debe devolver 404 cuando el todo no existe', async () => {
    const response = await request(app).get('/api/v1/todos/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Todo no encontrado');
  });
});

// Test de la ruta POST /todos
describe('POST /api/v1/todos', () => {
  it('debe crear un nuevo todo con datos válidos', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .send(newTodoData);
    
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(2);
    expect(response.body.title).toBe(newTodoData.title);
    expect(response.body.description).toBe(newTodoData.description);
    expect(response.body.completed).toBe(newTodoData.completed);
  });

  it('debe devolver 400 con datos inválidos', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .send({ description: 'Missing required fields' });
    
    expect(response.status).toBe(400);
  });
});

// Test de la ruta PATCH /todos/:id
describe('PATCH /api/v1/todos/:id', () => {
  it('debe actualizar un todo existente', async () => {
    const response = await request(app)
      .patch('/api/v1/todos/1')
      .send(updateTodoData);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
    expect(response.body.title).toBe(updateTodoData.title);
    expect(response.body.completed).toBe(updateTodoData.completed);
    // Los campos no incluidos en la actualización deben mantenerse
    expect(response.body.description).toBe(mockTodo.description);
  });

  it('debe devolver 404 cuando se intenta actualizar un todo inexistente', async () => {
    const response = await request(app)
      .patch('/api/v1/todos/999')
      .send(updateTodoData);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Todo no encontrado');
  });
});

// Test de la ruta DELETE /todos/:id
describe('DELETE /api/v1/todos/:id', () => {
  it('debe eliminar un todo existente', async () => {
    const response = await request(app).delete('/api/v1/todos/1');
    expect(response.status).toBe(204);
  });

  it('debe devolver 404 cuando se intenta eliminar un todo inexistente', async () => {
    const response = await request(app).delete('/api/v1/todos/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Todo no encontrado');
  });
});

// Test para rutas no definidas
describe('Rutas no definidas', () => {
  it('debe devolver 404 para rutas no definidas', async () => {
    const response = await request(app).get('/api/v1/ruta-inexistente');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
