
import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";
import { refreshToken } from "../controllers/RefreshToken";

const router = express.Router();

router.get('/users', verifyToken as any, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
