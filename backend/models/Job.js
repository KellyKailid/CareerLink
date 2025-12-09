import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [255, 'Company name cannot exceed 255 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [255, 'Location cannot exceed 255 characters'],
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    },
    salaryMin: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    salaryMax: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    skills: {
      type: String,
      maxlength: [500, 'Skills cannot exceed 500 characters'],
    },
    deadline: {
      type: Date,
    },
    link: {
      type: String,
      trim: true,
      maxlength: [2000, 'Link cannot exceed 2000 characters'],
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
jobSchema.index({ title: 'text', company: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;

