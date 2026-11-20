import { Router } from 'express';
import {
  getCinemas,
  createCinema,
  getBookingQuote,
} from '../controllers/bookingController.js';

const router = Router();

router.get('/cinemas', getCinemas);
router.post('/cinemas', createCinema);
router.get('/cinemas/:id/booking', getBookingQuote);

export default router;