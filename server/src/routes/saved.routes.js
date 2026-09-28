import { Router } from 'express';
import { getSavedPlaces, toggleSavedPlace } from '../controllers/savedController.js';

const router = Router();

router.get('/', getSavedPlaces);
router.post('/toggle', toggleSavedPlace);

export default router;
