import { Request, Response } from 'express';
import { generateToken } from "../middlewares/auth";
import { requestLogger } from "../utils/loggers/request";

export const signin = (req: Request, res: Response) => {
    const {name, email} = req.body;

    if(!name || !email) return res.status(400).json({errors: [{errCode: 400, message: "No name or email provided"}]})
    
    const user = {name, email};

    const accessToken = generateToken(user);

    //log
    const userAgent = req.get('user-agent');
    const ip = req.ip;
    requestLogger.info(`User signed in: ${user.name}`, { userAgent, ip });

    //auth
    res.header('authorization', accessToken).json({message: 'User auth', token: accessToken})
}