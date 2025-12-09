import mongoose from 'mongoose';

const savedExperienceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    experience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Compound unique index to prevent duplicate saves
savedExperienceSchema.index({ user: 1, experience: 1 }, { unique: true });

const SavedExperience = mongoose.model('SavedExperience', savedExperienceSchema);

export default SavedExperience;

