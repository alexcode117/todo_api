const createTodoSchema = () => {
    return Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        completed: Joi.boolean().required(),
        dueDate: Joi.date().required(),
    });
}

export { createTodoSchema };