import express from 'express';
import { getAllCrops, getCropById, calculateEarnings } from '../controllers/cropController.js';

const router = express.Router();

router.get('/', getAllCrops);
router.get('/:id', getCropById);
router.post('/calculate-earnings', calculateEarnings);

export default router;
