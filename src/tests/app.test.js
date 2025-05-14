import request from 'supertest';
import { testApp } from './setup.js';

// Crear una instancia de la aplicación para pruebas
const app = testApp();

// Mock para la respuesta de la API
jest.mock('../services/todo.service.js', () => ({
    TodoService: jest.fn().mockImplementation(() => ({
      getAllTodos: jest.fn().mockResolvedValue([
        { id: 1, title: 'Test Todo', description: 'Test Description', completed: false, dueDate: new Date(), createdAt: new Date(), updatedAt: new Date() }
      ])
    }))
}));

// Test de la ruta GET /todos
describe('GET /api/v1/todos', () => {
    it('debe devolver todos los todos', async () => {
        const response = await request(app).get('/api/v1/todos');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toBeDefined();
        expect(response.body).toHaveLength(1);
    });
});
