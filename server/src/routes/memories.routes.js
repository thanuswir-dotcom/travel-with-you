import { Router } from 'express';
import { getMemories, createMemory, toggleLikeMemory, deleteMemory } from '../controllers/memoriesController.js';

const router = Router();

router.get('/', getMemories);
router.post('/', createMemory);
router.post('/:id/like', toggleLikeMemory);
router.delete('/:id', deleteMemory);

export default router;
