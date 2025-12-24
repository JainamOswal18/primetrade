import Task from './task.model.js';
import redisClient from '../../config/redis.js';
import { successResponse } from '../../utils/apiResponse.js';

export const createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        // Invalidate cache if Redis is available
        if (redisClient) {
            await redisClient.del('all_tasks');
        }
        successResponse(res, task, 201);
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.findAll();
        successResponse(res, tasks);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        
        await task.update(req.body);
        
        // Invalidate cache if Redis is available
        if (redisClient) {
            await redisClient.del('all_tasks');
        }
        successResponse(res, task);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const deleted = await Task.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ success: false, message: 'Task not found' });
        
        // Invalidate cache if Redis is available
        if (redisClient) {
            await redisClient.del('all_tasks');
        }
        successResponse(res, { message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
