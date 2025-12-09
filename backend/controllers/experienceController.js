import Experience from '../models/Experience.js';

// @desc    Get all experiences with search and filters
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const { search, type } = req.query;

    // Build query
    const query = {};

    // Search by title or company (case-insensitive, partial match)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by type (exact match)
    if (type) {
      query.type = type;
    }

    const experiences = await Experience.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single experience by ID
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('postedBy', 'name email');

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new experience
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res) => {
  try {
    const experienceData = {
      ...req.body,
      postedBy: req.user._id,
    };

    const experience = await Experience.create(experienceData);
    const populatedExperience = await Experience.findById(experience._id).populate('postedBy', 'name email');

    res.status(201).json(populatedExperience);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Private (owner or admin)
export const updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check ownership or admin
    const isOwner = experience.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this experience' });
    }

    // Update experience - handle null values to clear fields
    const updateData = { ...req.body };
    
    // Convert null values to $unset for optional fields
    const fieldsToUnset = {};
    const optionalFields = ['duration', 'rating'];
    
    optionalFields.forEach(field => {
      if (updateData[field] === null) {
        fieldsToUnset[field] = 1;
        delete updateData[field];
      }
    });

    const updateQuery = Object.keys(fieldsToUnset).length > 0
      ? { $set: updateData, $unset: fieldsToUnset }
      : updateData;

    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json(experience);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Private (owner or admin)
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Check ownership or admin
    const isOwner = experience.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this experience' });
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get experiences posted by current user
// @route   GET /api/experiences/my
// @access  Private
export const getMyExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ postedBy: req.user._id })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

