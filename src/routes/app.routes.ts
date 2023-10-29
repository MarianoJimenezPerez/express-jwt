import express from 'express';
import { signin } from "../controllers/authController";
import { verifyToken } from "../middlewares/auth";
import { getAllUsers } from "../controllers/usersControllers";

const router = express.Router();

router.post('/signin', signin)

router.get('/private', verifyToken, getAllUsers)

export default router;