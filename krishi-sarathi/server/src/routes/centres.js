import express from 'express';
import { getAllCentres, getCentreById } from '../controllers/centreController.js';

const router = express.Router();

router.get('/', getAllCentres);
router.get('/:id', getCentreById);

export default router;
