/**
 * Middleware para validar datos de entrada según un esquema Joi
 * 
 * @param {Object} schema - Esquema Joi para validar los datos
 * @param {string} property - Propiedad de la solicitud a validar ('body', 'params', 'query', etc.)
 * @returns {Function} Middleware de Express que valida los datos
 */
const validatorHandler = (schema, property) => {
    return (req, res, next) => {
      const data = req[property];
      const { error } = schema.validate(data, { abortEarly: false });
      
      if (error) {
        // Si hay error, enviamos una respuesta con el error y detenemos la ejecución
        return res.status(400).json({
          message: 'Error de validación',
          errors: error.details.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      // Si no hay error, continuamos con el siguiente middleware
      next();
    }
};

export { validatorHandler };