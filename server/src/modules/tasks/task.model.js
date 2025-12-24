import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const Task = sequelize.define('Task', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'in-progress', 'completed'), defaultValue: 'pending' },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    assignedTo: { type: DataTypes.STRING, allowNull: true }
});

export default Task;
