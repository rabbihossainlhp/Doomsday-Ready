import { Router } from 'express';
import {
  getMovies,
  createMovie,
  updateMovie,
  getRewatchPlan,
} from '../controllers/movieController.js';

const router = Router();

router.get('/', getMovies);
router.post('/', createMovie);
router.patch('/:id', updateMovie);
router.get('/:id/rewatch-order', getRewatchPlan);

export default router;