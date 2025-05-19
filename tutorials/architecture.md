# Arquitectura de API REST TODO LIST

Este tutorial explica la arquitectura y los patrones de diseño utilizados en el proyecto API REST TODO LIST.

## Visión general de la arquitectura

El proyecto sigue una arquitectura en capas que separa claramente las responsabilidades:

```
┌─────────────────┐
│     Cliente     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      Rutas      │ ← Manejo de endpoints HTTP
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Controladores  │ ← Lógica de presentación
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Servicios    │ ← Lógica de negocio
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Modelos     │ ← Acceso a datos
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Base de datos │
└─────────────────┘
```

## Componentes principales

### 1. Rutas (Routes)

Las rutas definen los endpoints de la API y conectan las solicitudes HTTP con los controladores correspondientes. Se encuentran en el directorio `src/routes/`.

```javascript
// Ejemplo: src/routes/todo.routes.js
router.get('/', controller.getAllTodos.bind(controller));
router.post('/', validatorHandler(...), controller.createTodo.bind(controller));
```

### 2. Controladores (Controllers)

Los controladores manejan las solicitudes HTTP, validan los datos de entrada y delegan la lógica de negocio a los servicios. Se encuentran en el directorio `src/controllers/`.

```javascript
// Ejemplo: src/controllers/todo.controller.js
async getAllTodos(req, res) {
  try {
    const todos = await this.todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
}
```

### 3. Servicios (Services)

Los servicios contienen la lógica de negocio y se comunican con los modelos para acceder a los datos. Se encuentran en el directorio `src/services/`.

```javascript
// Ejemplo: src/services/todo.service.js
async getAllTodos() {
  try {
    const todos = await TodoModel.findAll({
      order: [['createdAt', 'DESC']]
    });
    return todos;
  } catch (error) {
    throw error;
  }
}
```

### 4. Modelos (Models)

Los modelos definen la estructura de los datos y proporcionan métodos para interactuar con la base de datos. Se encuentran en el directorio `src/models/`.

```javascript
// Ejemplo: src/models/todo.model.js
const TodoModel = db.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ...otros campos
});
```

### 5. Middleware

Los middleware procesan las solicitudes antes de que lleguen a los controladores. Se utilizan para validación, autenticación, etc. Se encuentran en el directorio `src/middleware/`.

```javascript
// Ejemplo: src/middleware/validatorHandler.js
const validatorHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    // ...validación
  }
};
```

### 6. Esquemas (Schemas)

Los esquemas definen la estructura y validación de los datos utilizando Joi. Se encuentran en el directorio `src/schemas/`.

```javascript
// Ejemplo: src/schemas/todoSchemas.js
createTodoSchema() {
  return Joi.object({
    title: Joi.string().required(),
    // ...otros campos
  });
}
```

## Flujo de datos

1. El cliente envía una solicitud HTTP a un endpoint específico
2. La solicitud es procesada por los middleware (CORS, JSON parsing, etc.)
3. La ruta correspondiente recibe la solicitud y la dirige al controlador adecuado
4. El controlador valida los datos de entrada utilizando esquemas Joi
5. El controlador llama al servicio correspondiente para ejecutar la lógica de negocio
6. El servicio interactúa con los modelos para acceder o modificar datos en la base de datos
7. El resultado se devuelve al controlador, que formatea la respuesta HTTP
8. La respuesta se envía de vuelta al cliente

## Patrones de diseño utilizados

1. **Patrón de Capas**: Separación clara de responsabilidades en capas (rutas, controladores, servicios, modelos)
2. **Inyección de Dependencias**: Los servicios se inyectan en los controladores
3. **Singleton**: La conexión a la base de datos se maneja como un singleton
4. **Middleware**: Uso de middleware para procesar solicitudes
5. **Repository Pattern**: Los servicios actúan como repositorios para acceder a los datos

## Diagrama de secuencia

A continuación se muestra un diagrama de secuencia simplificado para la operación "Crear Todo":

```
Cliente         Ruta           Controlador      Servicio        Modelo          BD
   │              │                │               │               │             │
   │ POST /todos  │                │               │               │             │
   │─────────────>│                │               │               │             │
   │              │ createTodo()   │               │               │             │
   │              │───────────────>│               │               │             │
   │              │                │ createTodo()  │               │             │
   │              │                │──────────────>│               │             │
   │              │                │               │ create()      │             │
   │              │                │               │──────────────>│             │
   │              │                │               │               │ INSERT      │
   │              │                │               │               │────────────>│
   │              │                │               │               │ resultado   │
   │              │                │               │               │<────────────│
   │              │                │               │ nuevo todo    │             │
   │              │                │               │<──────────────│             │
   │              │                │ todo creado   │               │             │
   │              │                │<──────────────│               │             │
   │              │ respuesta 201  │               │               │             │
   │              │<───────────────│               │               │             │
   │ 201 Created  │                │               │             │             │
   │<─────────────│                │               │               │             │
   │              │                │               │               │             │
```

Este diagrama muestra cómo fluye una solicitud a través de las diferentes capas de la aplicación.

## Conclusión

La arquitectura en capas utilizada en este proyecto proporciona varias ventajas:

1. **Mantenibilidad**: Cada componente tiene una responsabilidad única y bien definida
2. **Testabilidad**: Las capas se pueden probar de forma aislada
3. **Escalabilidad**: Es fácil agregar nuevas funcionalidades sin afectar las existentes
4. **Reutilización**: Los componentes se pueden reutilizar en diferentes partes de la aplicación

Esta arquitectura sigue las mejores prácticas de desarrollo de software y está diseñada para ser robusta, mantenible y escalable.
