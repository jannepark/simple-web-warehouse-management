import express from 'express';
import tokenExtractor from '../middlewares/tokenExtractor.js';
import { getLocations, createLocation, deleteLocation, updateLocation } from '../controllers/locations.js';

const router = express.Router();

router.get('/', tokenExtractor, getLocations);
router.post('/', tokenExtractor, createLocation);
router.put('/:id', tokenExtractor, updateLocation);
router.delete('/:id', tokenExtractor, deleteLocation);

export default router;