import { Router } from 'express';
import { getPlaces, getPlaceById, createReview } from '../controllers/placesController.js';

const router = Router();

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/:id/reviews', createReview);

export default router;
