import { Router } from 'express';
import { planTrip, chat, surpriseMe } from '../controllers/aiController.js';

const router = Router();

router.post('/plan', planTrip);
router.post('/chat', chat);
router.post('/surprise-me', surpriseMe);

export default router;
