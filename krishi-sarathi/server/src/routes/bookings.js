import express from 'express';
import { createBooking, getFarmerBookings, getBookingById } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getFarmerBookings);
router.get('/:id', authenticate, getBookingById);

export default router;
