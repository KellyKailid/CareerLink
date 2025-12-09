import express from 'express';
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  getMyExperiences,
} from '../controllers/experienceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getExperiences);

// Protected routes - order matters! /my must come before /:id
router.get('/my', protect, getMyExperiences);

// Public route for single experience
router.get('/:id', getExperienceById);

// Protected routes
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

export default router;

