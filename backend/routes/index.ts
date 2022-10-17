
import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users";
import { verifyToken } from "../middleware/VerifyToken";
import { refreshToken } from "../controllers/RefreshToken";
 
const router = express.Router();
 
router.get('/users', verifyToken as any, getUsers as any);
router.post('/users', Register as any);
router.post('/login', Login as any);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;
