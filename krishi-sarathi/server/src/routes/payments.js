import express from 'express';
import { getFarmerPayments, getPaymentReceipt } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-payments', authenticate, getFarmerPayments);
router.get('/receipt/:id', authenticate, getPaymentReceipt);

export default router;
