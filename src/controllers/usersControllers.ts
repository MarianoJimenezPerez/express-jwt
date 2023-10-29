import { Request, Response } from 'express';
import { IPerson } from '../types/person';
import { requestLogger } from '../utils/loggers/request';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IDecodedToken } from '../types/decodedToken';
import { defaultLogger } from '../utils/loggers/default';

dotenv.config();
const secret = process.env.SECRET;

export const getAllUsers = async (req: Request, res: Response) => {
    const URL = 'https://randomuser.me/api/?results=100';
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Something went wrong trying to access to the API data');
        }

        const data = await response.json(); 

        if (data && data.results && Array.isArray(data.results)) {
            const persons: IPerson[] = data.results;

            //log
            const token = req.headers['authorization'];

            if (!token || secret == undefined){
                return res.status(401).json({ message: 'Authorization header missing or invalid.' });
            }

            const decodedToken = jwt.verify(token, secret) as IDecodedToken;
            const userAgent = req.get('user-agent');
            const ip = req.ip;
            const userName = decodedToken.name;

            requestLogger.info(`User: ${userName} has solicited info about users list`, { userAgent, ip });

            return res.status(200).json(persons);
        } else {
            throw new Error('Something went wrong. Try again in a few minutes');
        }

        
    } catch (error) {
        defaultLogger.error('Error trying to access to the USERs API');
        return res.status(500).json({ errors: [{ errCode: 500, message: "Access to users could not be possible" }] });
    }
}

