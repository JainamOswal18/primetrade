import Joi from 'joi';

export const taskSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().max(255).optional()
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().optional(),
    assignedTo: Joi.string().max(255).optional()
}).min(1);
