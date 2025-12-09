import SavedJob from '../models/SavedJob.js';
import SavedExperience from '../models/SavedExperience.js';
import Job from '../models/Job.js';
import Experience from '../models/Experience.js';

// ==================== SAVED JOBS ====================

// @desc    Get user's saved jobs
// @route   GET /api/saved/jobs
// @access  Private
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'postedBy',
          select: 'name email',
        },
      })
      .sort({ savedAt: -1 });

    // Extract just the job data with savedAt
    const jobs = savedJobs.map((saved) => ({
      ...saved.job.toObject(),
      savedAt: saved.savedAt,
      savedId: saved._id,
    }));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/saved/jobs/:jobId
// @access  Private
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Save the job
    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Job already saved' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unsave a job
// @route   DELETE /api/saved/jobs/:jobId
// @access  Private
export const unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: jobId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if a job is saved by current user
// @route   GET /api/saved/jobs/:jobId/check
// @access  Private
export const checkJobSaved = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      user: req.user._id,
      job: jobId,
    });

    res.json({ isSaved: !!savedJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== SAVED EXPERIENCES ====================

// @desc    Get user's saved experiences
// @route   GET /api/saved/experiences
// @access  Private
export const getSavedExperiences = async (req, res) => {
  try {
    const savedExperiences = await SavedExperience.find({ user: req.user._id })
      .populate({
        path: 'experience',
        populate: {
          path: 'postedBy',
          select: 'name email',
        },
      })
      .sort({ savedAt: -1 });

    // Extract just the experience data with savedAt
    const experiences = savedExperiences.map((saved) => ({
      ...saved.experience.toObject(),
      savedAt: saved.savedAt,
      savedId: saved._id,
    }));

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Save an experience
// @route   POST /api/saved/experiences/:experienceId
// @access  Private
export const saveExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check if already saved
    const existingSave = await SavedExperience.findOne({
      user: req.user._id,
      experience: experienceId,
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Experience already saved' });
    }

    // Save the experience
    const savedExperience = await SavedExperience.create({
      user: req.user._id,
      experience: experienceId,
    });

    res.status(201).json({ message: 'Experience saved successfully', savedExperience });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Experience already saved' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unsave an experience
// @route   DELETE /api/saved/experiences/:experienceId
// @access  Private
export const unsaveExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const result = await SavedExperience.findOneAndDelete({
      user: req.user._id,
      experience: experienceId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Saved experience not found' });
    }

    res.json({ message: 'Experience removed from saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if an experience is saved by current user
// @route   GET /api/saved/experiences/:experienceId/check
// @access  Private
export const checkExperienceSaved = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const savedExperience = await SavedExperience.findOne({
      user: req.user._id,
      experience: experienceId,
    });

    res.json({ isSaved: !!savedExperience });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

