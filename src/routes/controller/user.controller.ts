import express from 'express';
import {userController} from '@routes/view/users/user';
import {authMiddleware} from '@middlewares/auth.middleware';

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
// Rota protegida: requer autenticação JWT no header Authorization
router.get('/me', authMiddleware, userController.me);

export default router;
