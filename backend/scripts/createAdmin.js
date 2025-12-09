import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@careerlink.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('  Email: admin@careerlink.com');
      console.log('  Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@careerlink.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('  Email:    admin@careerlink.com');
    console.log('  Password: admin123');
    console.log('  Role:     admin');
    console.log('');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();

