# API REST TODO LIST

Una API RESTful para gestionar tareas (todos) construida con Node.js, Express y MariaDB/Sequelize.

## Características

- Operaciones CRUD completas para tareas (todos)
- Validación de datos con Joi
- Arquitectura en capas (Controladores, Servicios, Modelos)
- Pruebas unitarias con Jest y Supertest
- Documentación de API con Swagger/OpenAPI
- Comentarios JSDoc en todo el código

## Requisitos Previos

- Node.js (v14.x o superior)
- MariaDB (v10.x o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/api-rest-todo-list.git
   cd api-rest-todo-list
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto basado en el siguiente ejemplo:
   ```
   PORT=9000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_NAME=todo_db
   DB_PORT=3306
   ```

4. Crea la base de datos:
   ```sql
   CREATE DATABASE todo_db;
   ```

5. Inicia el servidor:
   ```bash
   npm run dev
   ```

6. Accede a la documentación de la API:
   ```
   http://localhost:9000/api/v1/docs
   ```

## Estructura del Proyecto

```
api-rest-todo-list/
├── src/
│   ├── config/         # Configuración de la aplicación
│   │   ├── config.js   # Variables de entorno
│   │   ├── db.js       # Configuración de la base de datos
│   │   └── swagger.js  # Configuración de Swagger
│   ├── controllers/    # Controladores de la API
│   ├── middleware/     # Middleware personalizado
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas
│   ├── schemas/        # Esquemas de validación
│   ├── services/       # Lógica de negocio
│   ├── tests/          # Pruebas unitarias
│   └── app.js          # Configuración de Express
├── .env                # Variables de entorno (no incluido en git)
├── .gitignore          # Archivos ignorados por git
├── index.js            # Punto de entrada de la aplicación
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```

## Documentación de la API

La API está documentada con Swagger/OpenAPI. Puedes acceder a la documentación interactiva en:

```
http://localhost:9000/api/v1/docs
```

Esta interfaz te permite:
- Ver todos los endpoints disponibles
- Probar las operaciones directamente desde el navegador
- Ver los esquemas de datos y respuestas
- Entender los parámetros requeridos para cada operación

## Endpoints de la API

### Obtener todas las tareas
```
GET /api/v1/todos
```

### Obtener una tarea por ID
```
GET /api/v1/todos/:id
```

### Crear una nueva tarea
```
POST /api/v1/todos
```
Cuerpo de la solicitud:
```json
{
  "title": "Completar proyecto",
  "description": "Terminar el proyecto de API REST",
  "completed": false,
  "dueDate": "2025-06-01T00:00:00.000Z"
}
```

### Actualizar una tarea
```
PATCH /api/v1/todos/:id
```
Cuerpo de la solicitud (todos los campos son opcionales):
```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "completed": true,
  "dueDate": "2025-06-15T00:00:00.000Z"
}
```

### Eliminar una tarea
```
DELETE /api/v1/todos/:id
```

## Pruebas

Para ejecutar las pruebas:
```bash
npm test
```

## Mejoras Futuras

- Implementación de autenticación y autorización con JWT
- Paginación, filtrado y ordenamiento de resultados
- Sistema de etiquetas para las tareas
- Búsqueda de texto completo
- Implementación de caché para mejorar el rendimiento

## Licencia

Este proyecto está licenciado bajo la Licencia ISC - ver el archivo LICENSE para más detalles.