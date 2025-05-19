# Primeros pasos con API REST TODO LIST

Este tutorial te guiará a través de los primeros pasos para comenzar a utilizar la API REST TODO LIST.

## Requisitos previos

Asegúrate de tener instalado:
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

## Verificación de la instalación

Una vez que el servidor esté en funcionamiento, puedes verificar que todo está funcionando correctamente accediendo a:

- Documentación de la API: `http://localhost:9000/api/v1/docs`
- Endpoint principal: `http://localhost:9000/api/v1/todos`

## Ejemplos de uso

### Crear una nueva tarea

```bash
curl -X POST http://localhost:9000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completar proyecto",
    "description": "Terminar el proyecto de API REST",
    "completed": false,
    "dueDate": "2025-06-01T00:00:00.000Z"
  }'
```

### Obtener todas las tareas

```bash
curl -X GET http://localhost:9000/api/v1/todos
```

### Obtener una tarea específica

```bash
curl -X GET http://localhost:9000/api/v1/todos/1
```

### Actualizar una tarea

```bash
curl -X PATCH http://localhost:9000/api/v1/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Eliminar una tarea

```bash
curl -X DELETE http://localhost:9000/api/v1/todos/1
```

## Siguientes pasos

Una vez que hayas configurado el proyecto y probado los endpoints básicos, puedes:

1. Explorar la documentación completa de la API en Swagger
2. Revisar el código fuente para entender la arquitectura
3. Implementar tus propias mejoras y características adicionales
