import express from 'express';
import { getTrackingTimeline, updateOperatorStage } from '../controllers/trackingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:identifier', getTrackingTimeline);
router.post('/operator-update', authenticate, updateOperatorStage);

export default router;
