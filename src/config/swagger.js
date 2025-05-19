import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './config.js';

/**
 * Configuración de Swagger para la documentación de la API
 * Define la información básica de la API y las rutas para los archivos de documentación
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST TODO LIST',
      version: '1.0.0',
      description: 'Una API RESTful para gestionar tareas (todos) construida con Node.js, Express y MariaDB/Sequelize',
      contact: {
        name: 'Alex',
        url: 'https://github.com/alexcode117/todo_api',
        email: 'alexcode7vzla@gmail.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['title', 'description', 'completed', 'dueDate'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la tarea',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Título de la tarea',
              example: 'Completar proyecto'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada de la tarea',
              example: 'Terminar el proyecto de API REST'
            },
            completed: {
              type: 'boolean',
              description: 'Estado de completitud de la tarea',
              example: false
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha límite para completar la tarea',
              example: '2025-06-01T00:00:00.000Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2025-05-19T09:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
              example: '2025-05-19T09:00:00.000Z'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error de validación'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo que causó el error',
                    example: 'title'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensaje descriptivo del error',
                    example: '"title" is required'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Solicitud inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Todo no encontrado'
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Error interno del servidor'
                  },
                  error: {
                    type: 'string',
                    example: 'Detalles del error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Rutas donde buscar los comentarios de Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec };
