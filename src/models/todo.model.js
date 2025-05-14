import { DataTypes } from 'sequelize';
import { db } from '../config/db.js';

const TodoModel = db.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  // Opciones del modelo
  tableName: 'todos',
  timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export { TodoModel };
