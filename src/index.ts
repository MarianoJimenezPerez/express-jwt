import express from "express";
import dotenv from 'dotenv'

//server
const app = express();
app.use(express.json());
dotenv.config()

//routes
app.get('/', (_req, res) => {
    res.json({"message": "ok"})
})


app.listen(process.env.DEV_PORT, () => {
    console.log(`server is running on port ${process.env.DEV_PORT}`)
})