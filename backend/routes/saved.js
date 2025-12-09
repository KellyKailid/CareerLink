import express from 'express';
import {
  getSavedJobs,
  saveJob,
  unsaveJob,
  checkJobSaved,
  getSavedExperiences,
  saveExperience,
  unsaveExperience,
  checkExperienceSaved,
} from '../controllers/savedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All saved routes require authentication
router.use(protect);

// Saved Jobs routes
router.get('/jobs', getSavedJobs);
router.post('/jobs/:jobId', saveJob);
router.delete('/jobs/:jobId', unsaveJob);
router.get('/jobs/:jobId/check', checkJobSaved);

// Saved Experiences routes
router.get('/experiences', getSavedExperiences);
router.post('/experiences/:experienceId', saveExperience);
router.delete('/experiences/:experienceId', unsaveExperience);
router.get('/experiences/:experienceId/check', checkExperienceSaved);

export default router;

