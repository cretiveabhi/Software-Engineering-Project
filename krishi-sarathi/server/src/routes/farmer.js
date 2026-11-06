import express from 'express';
import { getDashboardData } from '../controllers/farmerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardData);

export default router;
