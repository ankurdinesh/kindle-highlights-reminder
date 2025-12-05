import { Router } from 'express';
import {
  getHighlights,
  createHighlights,
  updateHighlight,
  deleteHighlight,
  syncHighlights,
  getSettings,
  updateSettings,
} from '../controllers/highlightsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Highlights routes
router.get('/', getHighlights);
router.post('/', createHighlights);
router.put('/:id', updateHighlight);
router.delete('/:id', deleteHighlight);

// Sync route
router.post('/sync', syncHighlights);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
