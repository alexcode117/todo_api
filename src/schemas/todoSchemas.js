import Joi from "joi";

class TodoSchema {
    
    createTodoSchema() {
        return Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            completed: Joi.boolean().required(),
            dueDate: Joi.date().required(),
        });
    }

    getTodoSchema() {
        return Joi.object({
            id: Joi.number().required(),
        });
    }

    updateTodoSchema() {
        return Joi.object({
            id: Joi.number().required(),
        });
    }

    updateTodoBodySchema() {
        return Joi.object({
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            completed: Joi.boolean().optional(),
            dueDate: Joi.date().optional(),
        });
    }

    deleteTodoSchema() {
        return Joi.object({
            id: Joi.number().required(),
        });
    }
}

export { TodoSchema };