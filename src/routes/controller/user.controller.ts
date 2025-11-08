import express from 'express';
import {userController} from '@routes/users/user';
const router = express.Router();

router.post('/register', userController.register);

export default router;
