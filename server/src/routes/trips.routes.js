import { Router } from 'express';
import { getTrips, createTrip, deleteTrip } from '../controllers/tripsController.js';

const router = Router();

router.get('/', getTrips);
router.post('/', createTrip);
router.delete('/:id', deleteTrip);

export default router;
