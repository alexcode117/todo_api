import { todoSchema } from '../validation/todo.validation.js';
import { sequelize } from '../config/db.js';

// Mock de la conexión a la base de datos
jest.mock('../config/db.js', () => ({
  sequelize: {
    close: jest.fn().mockResolvedValue(true)
  }
}));

describe('Todo Validation Schema', () => {
  // Datos de ejemplo válidos para las pruebas
  const validTodoData = {
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    dueDate: new Date().toISOString()
  };

  // Cerrar conexiones después de todas las pruebas
  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Dar tiempo para que se completen las operaciones pendientes
    jest.clearAllMocks();
    await sequelize.close();
  });

  describe('title validation', () => {
    it('debe aceptar un título válido', () => {
      const result = todoSchema.validate(validTodoData);
      expect(result.error).toBeUndefined();
    });

    it('debe rechazar un título vacío', () => {
      const data = { ...validTodoData, title: '' };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('title');
    });

    it('debe rechazar cuando el título no está presente', () => {
      const { title, ...dataWithoutTitle } = validTodoData;
      const result = todoSchema.validate(dataWithoutTitle);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('title');
    });

    it('debe rechazar un título demasiado largo', () => {
      const data = { 
        ...validTodoData, 
        title: 'a'.repeat(101) // Título de 101 caracteres (asumiendo un máximo de 100)
      };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('title');
    });
  });

  describe('description validation', () => {
    it('debe aceptar una descripción válida', () => {
      const result = todoSchema.validate(validTodoData);
      expect(result.error).toBeUndefined();
    });

    it('debe aceptar cuando la descripción no está presente', () => {
      const { description, ...dataWithoutDescription } = validTodoData;
      const result = todoSchema.validate(dataWithoutDescription);
      expect(result.error).toBeUndefined();
    });

    it('debe rechazar una descripción demasiado larga', () => {
      const data = { 
        ...validTodoData, 
        description: 'a'.repeat(501) // Descripción de 501 caracteres (asumiendo un máximo de 500)
      };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('description');
    });
  });

  describe('completed validation', () => {
    it('debe aceptar un valor completed válido (true)', () => {
      const data = { ...validTodoData, completed: true };
      const result = todoSchema.validate(data);
      expect(result.error).toBeUndefined();
    });

    it('debe aceptar un valor completed válido (false)', () => {
      const data = { ...validTodoData, completed: false };
      const result = todoSchema.validate(data);
      expect(result.error).toBeUndefined();
    });

    it('debe aceptar cuando completed no está presente', () => {
      const { completed, ...dataWithoutCompleted } = validTodoData;
      const result = todoSchema.validate(dataWithoutCompleted);
      expect(result.error).toBeUndefined();
    });

    it('debe rechazar un valor completed que no sea booleano', () => {
      const data = { ...validTodoData, completed: 'no' };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('completed');
    });
  });

  describe('dueDate validation', () => {
    it('debe aceptar una fecha válida en formato ISO', () => {
      const result = todoSchema.validate(validTodoData);
      expect(result.error).toBeUndefined();
    });

    it('debe aceptar cuando dueDate no está presente', () => {
      const { dueDate, ...dataWithoutDueDate } = validTodoData;
      const result = todoSchema.validate(dataWithoutDueDate);
      expect(result.error).toBeUndefined();
    });

    it('debe rechazar una fecha en formato inválido', () => {
      const data = { ...validTodoData, dueDate: '31/12/2023' }; // Formato no ISO
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('dueDate');
    });

    it('debe rechazar un valor de fecha que no sea string', () => {
      const data = { ...validTodoData, dueDate: 12345 };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('dueDate');
    });
  });

  describe('campos adicionales', () => {
    it('debe rechazar campos no permitidos en el esquema', () => {
      const data = { 
        ...validTodoData, 
        extraField: 'Este campo no debería estar aquí' 
      };
      const result = todoSchema.validate(data);
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain('extraField');
    });
  });
});
