import express from "express";
import dotenv from 'dotenv';
import { serverStartLogger } from "./utils/loggers/server";
import router from "./routes/app.routes";

const app = express();
app.use(express.json());
dotenv.config()

app.use('/', router);


app.listen(process.env.DEV_PORT, () => {
    serverStartLogger.info(`Server is running on port ${process.env.DEV_PORT}`);
})