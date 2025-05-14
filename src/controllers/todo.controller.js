import { TodoService } from '../services/todo.service.js';

class TodoController {
  constructor(todoService = new TodoService()) {
    this.todoService = todoService;
  }

  async getAllTodos(req, res) {
    try {
      const todos = await this.todoService.getAllTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching todos', error });
    }
  }

  async getTodoById(req, res) {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getTodoById(id);
      res.status(200).json(todo);
    } catch (error) {
      if(error.message === 'Todo no encontrado'){
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error al hacer fetching del todo', error: error.message });
    }
  }

  async createTodo(req, res) {
    try {
      // Validar que se proporcione al menos un título
      if (!req.body.title) {
        return res.status(400).json({ message: 'El título es obligatorio' });
      }
      const newTodo = await this.todoService.createTodo(req.body);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ message: 'Error creating todo', error });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const result = await this.todoService.deleteTodo(id);
      res.status(204).json(result);
    } catch (error) {
      if(error.message === 'Todo no encontrado'){
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
  }
};

export { TodoController };