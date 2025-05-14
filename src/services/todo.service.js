import { TodoModel } from '../models/todo.model.js';

class TodoService {
  constructor() {
  }

  async createTodo(todoData) {
    try {
      // Crear un nuevo todo en la base de datos
      const newTodo = await TodoModel.create(todoData);
      return newTodo;
    } catch (error) {
      console.error('Error al crear todo:', error);
      throw error;
    }
  }

  async getAllTodos() {
    try {
      // Obtener todos los todos de la base de datos
      const todos = await TodoModel.findAll({
        order: [['createdAt', 'DESC']] // Ordenar por fecha de creación descendente
      });
      return todos;
    } catch (error) {
      console.error('Error al obtener todos:', error);
      throw error;
    }
  }

  async getTodoById(id) {
    try {
      // Obtener un todo por su ID
      const todo = await TodoModel.findByPk(id);
      if (!todo) {
        throw new Error('Todo no encontrado');
      }
      return todo;
    } catch (error) {
      console.error(`Error al obtener todo con ID ${id}:`, error);
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      // Eliminar un todo por su ID
      await TodoModel.destroy({ where: { id } });
    } catch (error) {
      console.error('Error al eliminar todo:', error);
      throw error;
    }
  }
};

export { TodoService };