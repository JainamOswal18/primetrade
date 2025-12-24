import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';
import { successResponse } from '../../utils/apiResponse.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const register = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const user = await User.create({ username, email, password, role });
        const token = generateToken(user);
        successResponse(res, { token, user: { id: user.id, email: user.email, role: user.role } }, 201);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: 'Email already exists' });
        }
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        successResponse(res, { token, role: user.role });
    } catch (error) {
        next(error);
    }
};
