import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user';
import dotenv from 'dotenv';
import { defaultLogger } from '../utils/loggers/default';

dotenv.config();

const secret = process.env.SECRET;

export const generateToken = (user: IUser): string => {
    if (secret === undefined) {
        defaultLogger.error('SECRET is not defined in environment variables');
        throw new Error('SECRET is not defined in environment variables');
    }

    try {
        const token = jwt.sign(user, secret, { expiresIn: '1h' });
        defaultLogger.info(`Generated token for user: ${user.name}`);
        return token;
    } catch (error) {
        defaultLogger.error('Error generating token');
        throw new Error('Generate token error');
    }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization'];

    if (!accessToken) {
        defaultLogger.warn('No access token provided');
        return res.status(403).json({ errors: [{ errCode: 403, message: "No access token provided" }] });
    }

    if (secret === undefined) {
        defaultLogger.error('SECRET is not defined in environment variables');
        return res.status(500).json({ errors: [{ errCode: 500, message: "SECRET is not defined in environment variables" }]});
    }

    try {
        jwt.verify(accessToken, secret, (err) => {
            if (err) {
                defaultLogger.warn('Token invalid');
                return res.status(401).json({ errors: [{ errCode: 401, message: "Token invalid" }] });
            }
            defaultLogger.info('Token verified successfully');
            next();
        });
    } catch (error) {
        defaultLogger.error('Error verifying token');
        return res.status(500).json({ error: 'Token verification error' });
    }
};
