import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Experience title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [255, 'Company name cannot exceed 255 characters'],
    },
    type: {
      type: String,
      required: [true, 'Experience type is required'],
      enum: ['Intern', 'Interview', 'Full-time', 'Contract', 'Volunteer'],
    },
    content: {
      type: String,
      required: [true, 'Experience content is required'],
    },
    duration: {
      type: String,
      maxlength: [100, 'Duration cannot exceed 100 characters'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
experienceSchema.index({ title: 'text', company: 'text' });

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;

