import express from 'express';
import {userController} from '@routes/users/user';
const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);

export default router;
