import express from 'express';
import {campaignController} from '@routes/view/campaigns/campaign';
import {authMiddleware} from '@middlewares/auth.middleware';

const router = express.Router();

// Todas as rotas de campanha requerem autenticação
router.post('/create', authMiddleware, campaignController.create);
router.get('/list', authMiddleware, campaignController.list);
router.post('/:campaignId/join', authMiddleware, campaignController.join);
router.post('/:campaignId/leave', authMiddleware, campaignController.leave);

export default router;

