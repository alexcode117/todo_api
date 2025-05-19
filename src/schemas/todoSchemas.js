import Joi from "joi";

/**
 * Clase que contiene los esquemas de validación para las operaciones CRUD de todos
 * Utiliza la biblioteca Joi para definir y validar los esquemas
 */
class TodoSchema {
    
    /**
     * Esquema para validar la creación de un nuevo todo
     * @returns {Object} Esquema Joi con validaciones para todos los campos requeridos
     */
    createTodoSchema() {
        return Joi.object({
            title: Joi.string().required().description('Título de la tarea'),
            description: Joi.string().required().description('Descripción detallada de la tarea'),
            completed: Joi.boolean().required().description('Estado de completitud de la tarea'),
            dueDate: Joi.date().required().description('Fecha límite para completar la tarea'),
        });
    }

    /**
     * Esquema para validar la obtención de un todo por ID
     * @returns {Object} Esquema Joi con validación para el ID
     */
    getTodoSchema() {
        return Joi.object({
            id: Joi.number().required().description('ID único de la tarea'),
        });
    }

    /**
     * Esquema para validar la actualización de un todo (parámetros)
     * @returns {Object} Esquema Joi con validación para el ID en los parámetros
     */
    updateTodoSchema() {
        return Joi.object({
            id: Joi.number().required().description('ID único de la tarea a actualizar'),
        });
    }

    /**
     * Esquema para validar el cuerpo de la solicitud de actualización de un todo
     * Todos los campos son opcionales ya que se puede actualizar solo algunos campos
     * @returns {Object} Esquema Joi con validaciones para los campos opcionales
     */
    updateTodoBodySchema() {
        return Joi.object({
            title: Joi.string().optional().description('Nuevo título de la tarea'),
            description: Joi.string().optional().description('Nueva descripción de la tarea'),
            completed: Joi.boolean().optional().description('Nuevo estado de completitud'),
            dueDate: Joi.date().optional().description('Nueva fecha límite'),
        });
    }

    /**
     * Esquema para validar la eliminación de un todo
     * @returns {Object} Esquema Joi con validación para el ID
     */
    deleteTodoSchema() {
        return Joi.object({
            id: Joi.number().required().description('ID único de la tarea a eliminar'),
        });
    }
}

export { TodoSchema };