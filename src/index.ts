import express from "express";
import dotenv from 'dotenv';
import { generateToken, verifyToken } from "./middlewares/auth";
import { requestLogger } from "./utils/loggers/request";
import { serverStartLogger } from "./utils/loggers/server";

const app = express();
app.use(express.json());
dotenv.config()

app.post('/signin', (req, res) => {
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
})

app.get('/private', verifyToken, (_req, res) => {
    res.status(200).json({data: [{name: "user"}, {name: "user2"}]})
})

app.listen(process.env.DEV_PORT, () => {
    serverStartLogger.info(`Server is running on port ${process.env.DEV_PORT}`);
})